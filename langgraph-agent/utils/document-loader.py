# utils/document_loader.py
import os
import fitz  # Correct import for PyMuPDF
from docx import Document

def load_txt(file_path: str) -> str:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"❌ Error loading .txt file {file_path}: {e}")
        return ""

def load_pdf(file_path: str) -> str:
    try:
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    except Exception as e:
        print(f"❌ Error loading .pdf file {file_path}: {e}")
        return ""

def load_docx(file_path: str) -> str:
    try:
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"❌ Error loading .docx file {file_path}: {e}")
        return ""

def load_document(file_path: str) -> str:
    """Loads content from a .txt, .pdf, or .docx file."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".txt":
        return load_txt(file_path)
    elif ext == ".pdf":
        return load_pdf(file_path)
    elif ext == ".docx":
        return load_docx(file_path)
    else:
        print(f"⚠️ Unsupported file format: {ext}")
        return ""

def load_documents_from_folder(folder_path: str) -> dict[str, str]:
    """Loads all readable documents from a folder."""
    supported_exts = {".txt", ".pdf", ".docx"}
    documents = {}

    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return documents

    for filename in os.listdir(folder_path):
        ext = os.path.splitext(filename)[1].lower()
        if ext in supported_exts:
            file_path = os.path.join(folder_path, filename)
            content = load_document(file_path)
            if content:
                documents[filename] = content
    return documents
