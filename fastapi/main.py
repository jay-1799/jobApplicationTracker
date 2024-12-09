from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from docx import Document
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
import tempfile

app = FastAPI()

# Pydantic model to parse the input data
class CoverLetterRequest(BaseModel):
    cover_letter: str

def create_word_document(file_path, cover_letter):
    doc = Document()
    doc.add_paragraph(cover_letter)
    doc.save(file_path)
    return file_path

def authenticate_google_drive():
    SCOPES = ['https://www.googleapis.com/auth/drive.file']
    creds = None
    token_path = "token.json"  # Use /tmp for the writable file system
    credentials_path = "credentials.json"

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(token_path, 'w') as token:
            token.write(creds.to_json())

    return creds

def upload_to_google_drive(file_path, creds):
    service = build('drive', 'v3', credentials=creds)
    file_metadata = {
        'name': os.path.basename(file_path),
        'mimeType': 'application/vnd.google-apps.document'
    }
    media = MediaFileUpload(file_path, mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id').execute()
    return file.get('id')

# API endpoint to create and upload a Word document
@app.post("/upload_word_document/")
async def upload_word_document(request: CoverLetterRequest):
    # Create a temporary file for the Word document
    temp_file = tempfile.mktemp(suffix=".docx")
    
    create_word_document(temp_file, request.cover_letter)
    
    creds = authenticate_google_drive()
    
    try:
        file_id = upload_to_google_drive(temp_file, creds)
        return {"message": "File uploaded successfully", "file_id": file_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run the FastAPI app:
# uvicorn main:app --reload
