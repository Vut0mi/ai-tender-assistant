from nova_act import NovaAct
from typing import Dict, Any, List
import asyncio
import base64
import os
from datetime import datetime

BOOL_SCHEMA = {
    "type": "object",
    "properties": {
        "value": {"type": "boolean"}
    },
    "required": ["value"]
}

REQUIREMENTS_SCHEMA = {
    "type": "object",
    "properties": {
        "requirements": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["requirements"]
}

class TenderActAgent:
    def __init__(self, user_data: Dict[str, Any]):
        self.user_data = user_data
        self.filled_fields = []
        self.session_logs = []
        
    def log_action(self, action: str, status: str = "success"):
        self.session_logs.append({
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "status": status
        })
        
    async def fill_tender_form(self, url: str) -> Dict[str, Any]:
        """Main method to fill tender form using Nova Act"""
        
        os.makedirs("./logs", exist_ok=True)
        os.makedirs("./chrome-profile", exist_ok=True)
        os.makedirs("./recordings", exist_ok=True)
        
        video_filename = f"recordings/tender_filling_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
        
        with NovaAct(
            starting_page=url,
            headless=False,
            record_video=True,
            video_save_path=video_filename,
            logs_directory="./logs",
            user_data_dir="./chrome-profile",
            timeout_seconds=30
        ) as nova:
            
            try:
                self.log_action("Starting Nova Act session")
                
                # Find and click apply button
                await self._find_apply_button(nova)
                await asyncio.sleep(2)
                
                # Fill company information
                await self._fill_company_info(nova)
                await self._fill_contact_info(nova)
                
                # Check requirements
                requirements = await self._check_requirements(nova)
                
                # Check if ready for signature
                ready = await self._check_signature_ready(nova)
                
                # Get screenshot
                screenshot = nova.page.screenshot()
                screenshot_b64 = base64.b64encode(screenshot).decode('utf-8')
                
                self.log_action("Form filling completed", "success")
                
                return {
                    "filled_fields": self.filled_fields,
                    "missing_requirements": requirements,
                    "ready_for_signature": ready,
                    "screenshot": screenshot_b64,
                    "logs": self.session_logs,
                    "video_path": video_filename if os.path.exists(video_filename) else None
                }
                
            except Exception as e:
                self.log_action(f"Error: {str(e)}", "error")
                raise
    
    async def _find_apply_button(self, nova) -> bool:
        button_texts = ["Apply", "Apply Now", "New Application", "Start Application", "Bid"]
        for text in button_texts:
            try:
                result = nova.act(f"Click the button that says '{text}' if it exists")
                if "clicked" in str(result).lower():
                    self.filled_fields.append(f"Clicked {text}")
                    self.log_action(f"Clicked {text} button")
                    return True
            except:
                continue
        return False
    
    async def _fill_company_info(self, nova):
        fields = [
            ("company name", self.user_data.get("company_name", "")),
            ("registration number", self.user_data.get("registration_number", "")),
        ]
        for field_name, value in fields:
            if value:
                try:
                    nova.act(f"Find the {field_name} field and enter: {value}")
                    self.filled_fields.append(field_name)
                    self.log_action(f"Filled {field_name}")
                except:
                    continue
    
    async def _fill_contact_info(self, nova):
        fields = [
            ("email", self.user_data.get("email", "")),
            ("phone", self.user_data.get("phone", "")),
        ]
        for field_name, value in fields:
            if value:
                try:
                    nova.act(f"Enter {field_name}: {value}")
                    self.filled_fields.append(f"contact_{field_name}")
                    self.log_action(f"Filled {field_name}")
                except:
                    continue
    
    async def _check_requirements(self, nova) -> List[str]:
        try:
            result = nova.act(
                "What documents or information are still required? List them.",
                schema=REQUIREMENTS_SCHEMA
            )
            if result.matches_schema:
                return result.parsed_response.get("requirements", [])
        except:
            pass
        return []
    
    async def _check_signature_ready(self, nova) -> bool:
        try:
            result = nova.act(
                "Is there a submit or sign button visible and enabled?",
                schema=BOOL_SCHEMA
            )
            return result.matches_schema and result.parsed_response.get("value", False)
        except:
            return False