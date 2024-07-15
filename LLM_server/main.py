from fastapi import FastAPI, HTTPException
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

app = FastAPI()

# Load your model and tokenizer
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model_load_path = 'models/sentence_transformer'
bart_model_load_path = 'models/bart_model'
tokenizer_load_path = 'models/tokenizer'


# Load models
model = SentenceTransformer(model_load_path).to(device)
bart_model = BartForConditionalGeneration.from_pretrained(bart_model_load_path).to(device)
tokenizer = BartTokenizer.from_pretrained(tokenizer_load_path)
# CORS settings
origins = [
    "http://localhost:3000",
    # Add other origins if needed
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

def retrieve_embeddings_from_db(conn, target_collection_name):
    """Retrieves embeddings and their corresponding chunks for a specific collection name from the SQLite database."""
    c = conn.cursor()
    # c.execute('''
    #     SELECT embeddings.chunk_text, embeddings.embedding
    #     FROM embeddings
    #     INNER JOIN collections
    #     ON embeddings.collection_id = collections.id
    #     WHERE collections.collection_name = ?
    # ''', (target_collection_name,))

    c.execute('''
        SELECT chunk_text,embedding FROM embeddings''', (target_collection_name,))
    rows = c.fetchall()

    chunks = []
    embeddings = []

    for row in rows:
        chunk_text, emb_str = row
        emb = np.frombuffer(base64.b64decode(emb_str), dtype=np.float32)
        chunks.append(chunk_text)
        embeddings.append(emb)

    return chunks, embeddings

def query_with_bart_model(chunks, embeddings, query):
    """Generates a query result using the BART model based on the closest chunk embeddings."""
    query_embedding = model.encode(query, convert_to_tensor=True, device=device).cpu().numpy()
    similarities = np.dot(embeddings, query_embedding)

    most_similar_idx = np.argmax(similarities)
    most_similar_chunk = chunks[most_similar_idx]

    inputs = tokenizer([most_similar_chunk], max_length=1024, return_tensors='pt').to(device)
    summary_ids = bart_model.generate(inputs['input_ids'], num_beams=4, max_length=5, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summary

def connect_to_database(db_file):
    """Connects to the SQLite database."""
    conn = sqlite3.connect(db_file)
    return conn

@app.post("/query")
async def get_response(query: Query):
    try:
        conn = connect_to_database('final.db')
        chunks, embeddings = retrieve_embeddings_from_db(conn, "AR22")
        result = query_with_bart_model(chunks, embeddings, query.query)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
