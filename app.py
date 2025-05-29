from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from models.nlp_processing import check_grammar, extract_keywords, calculate_similarity
from models.evaluation import evaluate_answer
import os
import re
import pdfplumber
import pytesseract
from pdf2image import convert_from_bytes
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your-secret-key'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Dummy user store (replace with database in real app)
users = {}

# Tesseract and Poppler config
if os.name == 'nt':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    os.environ["TESSDATA_PREFIX"] = r"C:\Program Files\Tesseract-OCR\tessdata"
    poppler_path = r"C:\\poppler-24.08.0\\Library\\bin"
else:
    poppler_path = None  # Adjust for non-Windows if needed

@app.route('/')
def home():
    if 'email' in session:
        return render_template('index.html')
    return redirect(url_for('auth'))

@app.route('/auth', methods=['GET', 'POST'])
def auth():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        form_type = request.form.get('form_type')

        if form_type == 'signup':
            if email in users:
                return render_template('login_signup.html', error="Email already registered")
            users[email] = generate_password_hash(password)
            session['email'] = email
            return redirect(url_for('home'))

        elif form_type == 'login':
            if email in users and check_password_hash(users[email], password):
                session['email'] = email
                return redirect(url_for('home'))
            return render_template('login_signup.html', error="Invalid credentials")

    return render_template('login_signup.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth'))

@app.route('/upload')
def upload():
    if 'email' not in session:
        return redirect(url_for('auth'))
    return render_template('upload_pdf.html')

@app.route('/evaluate', methods=['POST'])
def evaluate():
    try:
        data = request.get_json()
        question = data['question']
        model_answer = data['model_answer']
        student_answer = data['student_answer']

        grammar_mistakes, grammar_feedback = check_grammar(student_answer)
        student_keywords = extract_keywords(student_answer)
        similarity_score = calculate_similarity(model_answer, student_answer)
        final_score, remark = evaluate_answer(grammar_mistakes, similarity_score)

        return jsonify({
            "question": question,
            "student_answer": student_answer,
            "grammar_mistakes": grammar_mistakes,
            "grammar_feedback": grammar_feedback,
            "keywords_used": student_keywords,
            "similarity_score": similarity_score,
            "final_score": final_score,
            "remark": remark
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/extract_pdf', methods=['POST'])
def extract_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF uploaded'}), 400

        pdf_file = request.files['pdf']

        if not pdf_file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'}), 400

        text = ''
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'

        if not text.strip():
            print("\u26a0\ufe0f Using OCR fallback...")
            pdf_file.seek(0)
            images = convert_from_bytes(pdf_file.read(), poppler_path=poppler_path)

            for image in images:
                ocr_text = pytesseract.image_to_string(image)
                ocr_text = re.sub(r'-\n', '', ocr_text)
                ocr_text = re.sub(r'\s{2,}', ' ', ocr_text)
                ocr_text = re.sub(r'(?<=\w)\n(?=\w)', ' ', ocr_text)
                ocr_text = re.sub(r'(?i)(Q[\s.:]*\d+)', r'\n\1', ocr_text)
                ocr_text = re.sub(r'(?i)(Ans|Solution)[\s.:]*', r'\n\1: ', ocr_text)
                text += ocr_text.strip() + '\n'

        lines = text.splitlines()
        cleaned = [line.strip() for line in lines if line.strip()]
        return jsonify({'text': '\n'.join(cleaned)})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/status')
def status():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
