from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import numpy as np
import sqlite3
from transformers import BertTokenizer, BertForMaskedLM, pipeline
import base64
from transformers import BartForConditionalGeneration, BartTokenizer, GPT2Tokenizer, GPT2LMHeadModel
import os
import torch
from datetime import datetime
from groq import Groq
from nltk.tokenize import sent_tokenize
import google.generativeai as genai
import nltk
from PIL import Image
import io
from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException
GOOGLE_API_KEY = 'AIzaSyDHjVCPUe9UXoBzDtDTOyYuXmvAHDYAduk'
genai.configure(api_key=GOOGLE_API_KEY)


gemini_model = genai.GenerativeModel('gemini-1.5-flash')

nltk.download('punkt')
app = FastAPI()

# Define paths
model_load_path = 'models/sentence_transformer'
bart_model_load_path = 'models/bart_model'
bart_tokenizer_load_path = 'models/tokenizer'
gpt2_model_load_path = 'models/gpt2_model'
gpt2_tokenizer_load_path = 'models/gpt2_tokenizer'

# Ensure models are loaded or downloaded
def ensure_model_exists(model_path, model_name, tokenizer_name=None):
    if not os.path.exists(model_path):
        os.makedirs(model_path)
        # Download the model
        if tokenizer_name:
            model = BertForMaskedLM.from_pretrained(model_name)
            tokenizer = BertTokenizer.from_pretrained(tokenizer_name)
        else:
            model = SentenceTransformer(model_name)
        model.save_pretrained(model_path)
        if tokenizer_name:
            tokenizer.save_pretrained(model_path)

# Ensure SentenceTransformer model exists
ensure_model_exists(model_load_path, 'sentence-transformers/all-MiniLM-L6-v2')

# Ensure BART model exists
ensure_model_exists(bart_model_load_path, 'facebook/bart-large-cnn')
bart_tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')

# Ensure GPT-2 model exists
gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
gpt2_model = GPT2LMHeadModel.from_pretrained("gpt2")
# gpt2_model = GPT2LMHeadModel.from_pretrained('gpt2')

# Load models
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = SentenceTransformer(model_load_path).to(device)
bart_model = BartForConditionalGeneration.from_pretrained(bart_model_load_path).to(device)
# gpt2_model = GPT2LMHeadModel.from_pretrained(gpt2_model_load_path).to(device)
# gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model_load_path).to(device)


client = Groq(api_key="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")

# CORS settings
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str

def retrieve_embeddings_from_db(conn, query):
    """Retrieves embeddings and their corresponding chunks for a specific collection name from the SQLite database."""
    c = conn.cursor()
    c.execute('''SELECT chunk_text, embedding FROM embeddings''')
    rows = c.fetchall()

    chunks = []
    embeddings = []

    for row in rows:
        chunk_text, emb_str = row
        emb = np.frombuffer(base64.b64decode(emb_str), dtype=np.float32)
        chunks.append(chunk_text)
        embeddings.append(emb)

    query_embedding = model.encode(query)
    similarities = util.pytorch_cos_sim(query_embedding, embeddings)[0]
    
    # Get the indices of the top 3 most similar chunks
    top_k = 3
    top_k_indices = np.argpartition(-similarities, top_k)[:top_k]

    # Sort the top_k indices by similarity in descending order
    top_k_indices = top_k_indices[np.argsort(-similarities[top_k_indices])]

    # Get the top 3 closest chunks
    closest_chunks = [chunks[idx] for idx in top_k_indices]

    return f"Question: {query} Context: {closest_chunks[0]} {closest_chunks[1]} {closest_chunks[2]}"

def bart(query):
    inputs = bart_tokenizer(query, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = bart_model.generate(
        inputs['input_ids'].to('cuda') if torch.cuda.is_available() else inputs['input_ids'],
        max_length=150, num_beams=4, length_penalty=2.0, early_stopping=True
    )
    response = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return response

def gpt2(query):
    input_text = query
    input_ids = gpt2_tokenizer.encode(input_text, return_tensors='pt')
    print(input_text)
    output_ids = gpt2_model.generate(
        input_ids, 
        max_length=512, 
        num_return_sequences=1,
        no_repeat_ngram_size=2, 
        temperature=0.5,
        top_p=0.9,
        do_sample=True,
        pad_token_id=gpt2_tokenizer.eos_token_id
    )
    answer = gpt2_tokenizer.decode(output_ids[0], skip_special_tokens=True)
    answer = answer.split("Answer:")[1].strip().split("\n")[0]
    sentences = sent_tokenize(answer)
    complete_answer = ' '.join(sentences[:-1]) if not answer.endswith('.') else answer
    return complete_answer

def connect_to_database(db_file):
    conn = sqlite3.connect(db_file)
    return conn


def detect_language(text):
    try:
        return detect(text)
    except LangDetectException:
        return 'en'  # Default to English if detection fails


def english_to_hindi(text):
    translated_text = GoogleTranslator(source='en', target='hi').translate(text)
    return translated_text

def hindi_to_english(text):
    translated_text = GoogleTranslator(source='hi', target='en').translate(text)
    return translated_text

@app.post("/bart")
async def get_response(query: Query):
    try:
           # Detect the language of the query
        detected_language = detect_language(query.query)

        # If the detected language is Hindi, translate it to English
        if detected_language == 'hi':
            query_in_english = hindi_to_english(query.query)
        else:
            query_in_english = query.query  # If it's already in English or another language

        conn = connect_to_database('final.db')
        queryFinal = retrieve_embeddings_from_db(conn, query_in_english)
        result = bart(queryFinal)
        if detected_language == 'hi':
            result = english_to_hindi(result)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/gpt2")
async def get_response(query: Query):
    try:
        conn = connect_to_database('final.db')
        queryFinal = retrieve_embeddings_from_db(conn, query.query)
        result = bart(queryFinal[:400])
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/llama3")
async def get_response(query: Query):
    try:
        messages = []
        conn = connect_to_database('final.db')

        # Detect the language of the query
        detected_language = detect_language(query.query)

        # If the detected language is Hindi, translate it to English
        if detected_language == 'hi':
            query_in_english = hindi_to_english(query.query)
        else:
            query_in_english = query.query  # If it's already in English or another language

        # Continue processing with the translated or original query
        queryFinal = retrieve_embeddings_from_db(conn, query_in_english)
        messages.append({
            "role": "user", 
            "content": ("remember you are an LLM used for ICAR-CRIDA work so please don't mention the context. "
                        "Just give a simple answer. Based on the context, give me the answer and just give the answer, "
                        "don't mention the data given to you. " + queryFinal)
        })
        
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        
        result = chat_completion.choices[0].message.content

        # If the original query was in Hindi, translate the result back to Hindi
        if detected_language == 'hi':
            result = english_to_hindi(result)

        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/gemini")
async def get_response(query: Query):
    # response = gemini_model.generate_content(query.query)
    # return {"response": response.text}
    try:
        messages = []
        conn = connect_to_database('final.db')
        queryFinal = retrieve_embeddings_from_db(conn, query.query)

        query_context = "based on this content "+ queryFinal+ "give me the answer for this question "+query.query  +"try to give me with in 100 words"                                   
        response = gemini_model.generate_content(query_context)

        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)