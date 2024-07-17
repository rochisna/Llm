from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import numpy as np
import sqlite3
from transformers import BertTokenizer, BertForMaskedLM, pipeline
import base64
from transformers import BartForConditionalGeneration, BartTokenizer
import os
import torch
from datetime import datetime
from groq import Groq
from transformers import GPT2Tokenizer, GPT2LMHeadModel
from nltk.tokenize import sent_tokenize
import google.generativeai as genai
import nltk
from PIL import Image
import io

nltk.download('punkt')
app = FastAPI()

# Load your model and tokenizer
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model_load_path = 'models/sentence_transformer'
bart_model_load_path = 'models/bart_model'
bart_tokenizer_load_path = 'models/tokenizer'

gpt2_model_load_path = 'models/gpt2_model'
gpt2_tokenizer_load_path = 'models/gpt2_tokenizer'


# Load models
model = SentenceTransformer(model_load_path).to(device)

bart_model = BartForConditionalGeneration.from_pretrained(bart_model_load_path).to(device)
bart_tokenizer = BartTokenizer.from_pretrained(bart_tokenizer_load_path)

# gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_tokenizer_load_path)
# gpt2_model = GPT2LMHeadModel.from_pretrained(gpt2_model_load_path)


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

def query_with_bart_model_with_one_chunk(chunks, embeddings, query):
    query_embedding = model.encode(query)
    similarities = util.pytorch_cos_sim(query_embedding, embeddings)[0]
    most_similar_idx = np.argmax(similarities)
    most_similar_chunk = chunks[most_similar_idx]
    input_text = f"Question: {query} Context: {most_similar_chunk}"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = bart_model.generate(
        inputs['input_ids'].to('cuda') if torch.cuda.is_available() else inputs['input_ids'],
        max_length=150, num_beams=4, length_penalty=2.0, early_stopping=True
    )
    response = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return response

def connect_to_database(db_file):
    conn = sqlite3.connect(db_file)
    return conn

@app.post("/bart")
async def get_response(query: Query):
    try:
        conn = connect_to_database('final.db')
        queryFinal = retrieve_embeddings_from_db(conn, query.query)
        result = bart(queryFinal)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/gpt2")
async def get_response(query: Query):
    try:
        conn = connect_to_database('final.db')
        queryFinal = retrieve_embeddings_from_db(conn, query.query)
        result = gpt2(queryFinal)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/llama3")
async def get_response(query: Query):
    try:
        messages = []
        conn = connect_to_database('final.db')
        queryFinal = retrieve_embeddings_from_db(conn, query.query)
        messages.append({
            "role": "user", 
            "content": "remember u are an llm which is used for icar-crida work so please dont mention abt context just give a simple answer .this are" + queryFinal + "based on the context give me the answer "
        })
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        result = chat_completion.choices[0].message.content
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
