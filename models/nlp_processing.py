import spacy
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import language_tool_python

# Load spaCy language model
nlp = spacy.load("en_core_web_sm")

# Download NLTK dependencies
nltk.download("punkt")
nltk.download("stopwords")

# Initialize grammar checking tool
tool = language_tool_python.LanguageTool('en-US')

def check_grammar(text):
    """
    Checks grammar mistakes using LanguageTool.
    Returns number of mistakes and messages.
    """
    matches = tool.check(text)
    messages = [f"{i+1}. {match.message}" for i, match in enumerate(matches)]
    return len(matches), messages

def extract_keywords(text):
    """
    Extracts meaningful keywords from text.
    Uses tokenization and stopword removal.
    """
    words = word_tokenize(text.lower())
    filtered_words = [
        word for word in words
        if word.isalnum() and word not in stopwords.words("english")
    ]
    return list(set(filtered_words))  # Return unique keywords

def calculate_similarity(model_answer, student_answer):
    """
    Calculates semantic similarity between model and student answers.
    Uses TF-IDF vectorization and cosine similarity.
    """
    if not model_answer or not student_answer:
        return 0.0

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([model_answer, student_answer])
    similarity_score = cosine_similarity(vectors)[0][1]
    return round(similarity_score * 100, 2)  # Return as a percentage
