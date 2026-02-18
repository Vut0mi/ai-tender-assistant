from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uuid
import os
from datetime import datetime
from dotenv import load_dotenv

from nova_services.act_agent import TenderActAgent
from nova_services.embeddings import TenderEmbeddingService
from api.websocket_manager import ConnectionManager

load_dotenv()

app = FastAPI(title="AI Tender Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()
active_processes = {}

class TenderRequest(BaseModel):
    url: str
    company_name: str
    registration_number: str
    email: str
    phone: str

@app.get("/")
async def root():
    return {"message": "AI Tender Assistant API", "status": "running"}

@app.post("/api/start-tender")
async def start_tender_process(
    request: TenderRequest,
    background_tasks: BackgroundTasks
):
    process_id = str(uuid.uuid4())
    active_processes[process_id] = {
        "id": process_id,
        "status": "starting",
        "user_data": request.dict(),
        "started_at": datetime.now().isoformat()
    }
    
    background_tasks.add_task(
        process_tender_application,
        process_id,
        request.url,
        request.dict()
    )
    
    return {"process_id": process_id, "status": "processing"}

@app.get("/api/status/{process_id}")
async def get_process_status(process_id: str):
    if process_id in active_processes:
        return active_processes[process_id]
    raise HTTPException(status_code=404, detail="Process not found")

@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    embedding_service = TenderEmbeddingService()
    contents = await file.read()
    temp_path = f"/tmp/{uuid.uuid4()}_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)
    requirements = await embedding_service.analyze_document(temp_path)
    os.remove(temp_path)
    return {"filename": file.filename, "requirements": requirements}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@app.get("/api/download-recording/{process_id}")
async def download_recording(process_id: str):
    if process_id in active_processes:
        process = active_processes[process_id]
        if "video_path" in process and os.path.exists(process["video_path"]):
            return FileResponse(process["video_path"])
    raise HTTPException(status_code=404, detail="Recording not found")

async def process_tender_application(process_id: str, url: str, user_data: dict):
    try:
        active_processes[process_id]["status"] = "navigating"
        await manager.broadcast("navigating", {"process_id": process_id, "status": "Navigating to tender portal..."})
        
        agent = TenderActAgent(user_data)
        result = await agent.fill_tender_form(url)
        
        active_processes[process_id].update({
            "status": "requirements_check",
            "filled_fields": result.get("filled_fields", []),
            "video_path": result.get("video_path")
        })
        
        missing_reqs = result.get("missing_requirements", [])
        if missing_reqs:
            await manager.broadcast("requirements", {
                "process_id": process_id,
                "requirements": missing_reqs
            })
            active_processes[process_id]["requirements"] = missing_reqs
        
        if result.get("ready_for_signature"):
            active_processes[process_id]["status"] = "ready_for_signature"
            await manager.broadcast("ready_for_signature", {
                "process_id": process_id,
                "message": "Form is ready for your signature!"
            })
        else:
            active_processes[process_id]["status"] = "completed"
            await manager.broadcast("completed", {"process_id": process_id})
            
    except Exception as e:
        active_processes[process_id]["status"] = "error"
        active_processes[process_id]["error"] = str(e)
        await manager.broadcast("error", {"process_id": process_id, "error": str(e)})