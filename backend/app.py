from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import PyPDF2
from docx import Document
import json

# Load environment variables
load_dotenv()

app = Flask(__name__, 
            template_folder=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates'),
            static_folder=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static'))
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(docx_file):
    doc = Document(docx_file)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/compare')
def compare():
    return render_template('compare.html')

@app.route('/results')
def results():
    return render_template('results.html')

@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file provided'}), 400
    
    resume_file = request.files['resume']
    job_role = request.form.get('job_role', '')
    
    # Extract text based on file type
    if resume_file.filename.endswith('.pdf'):
        text = extract_text_from_pdf(resume_file)
    elif resume_file.filename.endswith('.docx'):
        text = extract_text_from_docx(resume_file)
    else:
        return jsonify({'error': 'Unsupported file format'}), 400
    
    # Use Gemini to parse resume
    prompt = f"""
    Parse this resume and extract the following information in JSON format:
    - name
    - email
    - phone
    - education
    - skills
    - experience
    - projects
    Also analyze how well this resume matches the job role: {job_role}
    and provide an ATS score (0-100) and improvement suggestions.
    
    Resume text:
    {text}
    """
    
    try:
        response = model.generate_content(prompt)
        parsed_data = json.loads(response.text)
        return jsonify(parsed_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/compare-resumes', methods=['POST'])
def compare_resumes():
    if 'resume1' not in request.files or 'resume2' not in request.files:
        return jsonify({'error': 'Both resume files are required'}), 400
    
    resume1 = request.files['resume1']
    resume2 = request.files['resume2']
    job_role = request.form.get('job_role', '')
    
    # Extract text from both resumes
    text1 = extract_text_from_pdf(resume1) if resume1.filename.endswith('.pdf') else extract_text_from_docx(resume1)
    text2 = extract_text_from_pdf(resume2) if resume2.filename.endswith('.pdf') else extract_text_from_docx(resume2)
    
    # Use Gemini to compare resumes
    prompt = f"""
    Compare these two resumes for the job role: {job_role}
    
    Resume 1:
    {text1}
    
    Resume 2:
    {text2}
    
    Provide a detailed comparison in JSON format with:
    - ATS scores for both resumes (0-100)
    - Key strengths of each resume
    - Areas for improvement for each resume
    - Which resume is better suited for the job role and why
    """
    
    try:
        response = model.generate_content(prompt)
        comparison_data = json.loads(response.text)
        return jsonify(comparison_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 