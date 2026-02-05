# AI Tender Assistant (Amazon Nova Powered)

An AI-powered assistant that analyzes public sector tender documents, auto-fills required forms using company information, flags compliance gaps, and prepares ready-to-sign submission packs — built using Amazon Nova foundation models on AWS.

---

## 🚀 Project Overview

Public sector tenders are complex, document-heavy, and time-consuming, often excluding small and medium enterprises that lack dedicated bid or legal teams. This project aims to reduce that barrier by using **generative and agentic AI** to assist — not replace — humans in preparing compliant tender submissions.

The system follows a **human-in-the-loop** approach:
- AI performs document understanding, reasoning, and preparation
- Humans retain full control over review, signing, and submission

---

## ✨ Key Features

- 📄 **Multimodal Tender Understanding**  
  Reads and analyzes tender PDFs, including text, tables, and form structures.

- 🤖 **Agentic AI Reasoning**  
  Identifies mandatory documents, required forms, and compliance instructions.

- 🧠 **Smart Form Auto-Filling**  
  Maps company profile data to relevant form fields using contextual retrieval.

- ✍🏽 **Signature Detection**  
  Flags fields that require manual review or digital signatures.

- ✅ **Compliance Checklist**  
  Generates a structured readiness report highlighting missing or incomplete items.

- 📦 **Ready-to-Sign Output Pack**  
  Prepares completed documents for final review and digital signing.

---

## 🧠 Amazon Nova Usage

This project is built on **Amazon Nova foundation models via Amazon Bedrock**:

- **Nova 2 Lite**  
  Used for reasoning over tender instructions, compliance logic, and field mapping.

- **Nova Multimodal / Embeddings**  
  Used to understand tender documents and retrieve relevant company profile data.

---

## 🏗️ Architecture (High-Level)

Frontend (React / Web UI)  
→ API Gateway  
→ AWS Lambda (Tender Orchestrator Agent)  
→ Amazon Bedrock (Nova Models)  
→ Amazon S3 (Documents) + DynamoDB (Company Profiles)

---

## 🧪 How It Works

1. User uploads tender document(s)
2. Documents are stored securely in Amazon S3
3. Lambda functions extract and preprocess content
4. Amazon Nova models analyze requirements and form structures
5. Company data is retrieved using embeddings
6. Forms are auto-filled where safe
7. Manual and signature-required fields are flagged
8. A compliance report and prepared documents are generated

---

## 📂 Repository Structure

ai-tender-assistant/
- backend/
- frontend/
- demo/
- docs/
- README.md

---

## 🛠️ Tech Stack

- Amazon Nova (via Amazon Bedrock)
- AWS Lambda
- Amazon S3
- Amazon DynamoDB
- API Gateway
- React / Next.js
- Serverless Framework

---

## 🔐 Responsible AI & Compliance

- The system does **not** submit tenders automatically
- All auto-filled fields are clearly marked
- Human review is required before signing
- Designed to assist, not replace, human judgment

---

## 🎥 Demo

A short demo video (~3 minutes) showcases:
- Tender upload
- AI analysis
- Auto-filled forms
- Signature detection
- Final output generation

**Hashtag:** #AmazonNova

---

## 🌍 Impact & Use Cases

- Small and medium enterprises responding to public tenders
- Procurement preparation teams
- NGOs and cooperatives with limited administrative capacity

---

## 🚧 Future Enhancements

- Integration with certified digital signing providers
- Automated portal submission using Nova Act
- Multi-language tender support
- Collaboration features for bid teams

---

## 📜 License

Provided for hackathon and educational purposes.
