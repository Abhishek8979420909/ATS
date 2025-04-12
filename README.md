# AI-Powered Resume Parser ATS

A full-stack AI-powered Resume Parser and Applicant Tracking System (ATS) specifically designed for BTech students. This system helps students understand how ATS systems work and provides personalized suggestions to improve their resumes.

## Features

- 📄 Resume Parsing: Extract structured data from PDF and DOCX resumes
- 🎯 ATS Score Calculation: Get detailed analysis of resume performance
- 💡 Improvement Suggestions: Receive actionable tips to enhance resume quality
- 🔄 Resume Comparison: Compare multiple resumes side by side
- 🎨 Modern UI: Dark-themed, responsive interface

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Python (Flask)
- AI Integration: Google's Gemini API

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-parser-ats
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and add your Google API key:
```
GOOGLE_API_KEY=your_api_key_here
```

5. Run the application:
```bash
python backend/app.py
```

6. Open your browser and navigate to `http://localhost:5000`

## Usage

1. **Home Page**: Learn about the system's features and capabilities
2. **Upload Resume**: Upload your resume (PDF or DOCX) and select a target job role
3. **View Results**: Get detailed analysis of your resume's ATS performance
4. **Compare Resumes**: Upload two resumes to compare their effectiveness

## Project Structure

```
resume-parser-ats/
├── backend/
│   └── app.py
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── upload.js
│       ├── results.js
│       └── compare.js
├── templates/
│   ├── index.html
│   ├── upload.html
│   ├── results.html
│   └── compare.html
├── requirements.txt
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 