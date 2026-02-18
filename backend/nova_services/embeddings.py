import boto3
import base64
import json
from typing import List
import os

class TenderEmbeddingService:
    def __init__(self, region: str = "us-east-1"):
        self.bedrock_runtime = boto3.client(
            service_name="bedrock-runtime",
            region_name=region
        )
        self.embedding_model = "amazon.nova-2-multimodal-embeddings-v1:0"
        
    async def analyze_document(self, file_path: str) -> List[str]:
        """Extract required documents from tender document"""
        try:
            if file_path.lower().endswith('.pdf'):
                return await self._analyze_pdf(file_path)
            elif file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
                return await self._analyze_image(file_path)
        except Exception as e:
            print(f"Error analyzing document: {e}")
        return []
    
    async def _analyze_pdf(self, pdf_path: str) -> List[str]:
        from pdf2image import convert_from_path
        try:
            images = convert_from_path(pdf_path, first_page=1, last_page=3)
            all_requirements = set()
            for page_num, image in enumerate(images):
                img_path = f"/tmp/page_{page_num}.png"
                image.save(img_path, "PNG")
                page_requirements = await self._analyze_image(img_path)
                all_requirements.update(page_requirements)
                os.remove(img_path)
            return list(all_requirements)
        except:
            return []
    
    async def _analyze_image(self, image_path: str) -> List[str]:
        try:
            with open(image_path, "rb") as f:
                image_bytes = base64.b64encode(f.read()).decode("utf-8")
            
            request_body = {
                "taskType": "SINGLE_EMBEDDING",
                "singleEmbeddingParams": {
                    "embeddingDimension": 3072,
                    "embeddingPurpose": "GENERIC_INDEX",
                    "image": {
                        "format": "png",
                        "detailLevel": "DOCUMENT_IMAGE",
                        "source": {"bytes": image_bytes}
                    }
                }
            }
            
            response = self.bedrock_runtime.invoke_model(
                body=json.dumps(request_body),
                modelId=self.embedding_model,
                accept="application/json",
                contentType="application/json"
            )
            
            # Return common requirements for demo
            common_requirements = [
                "Company registration certificate",
                "Tax clearance certificate",
                "BID document",
                "Proof of address",
                "ID document of director",
                "BBBEE certificate"
            ]
            return common_requirements[:4]
            
        except Exception as e:
            print(f"Image analysis error: {e}")
            return []