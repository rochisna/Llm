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

def retrieve_embeddings_from_db(conn):
    """Retrieves embeddings and their corresponding chunks for a specific collection name from the SQLite database."""
    c = conn.cursor()
    # c.execute('''
    #     SELECT embeddings.chunk_text, embeddings.embedding
    #     FROM embeddings
    #     INNER JOIN collections
    #     ON embeddings.collection_id = collections.id
    #     WHERE collections.collection_name = ?
    # ''', ("AR22",))

    c.execute(''' SELECT chunk_text,embedding FROM embeddings''')
    rows = c.fetchall()

    chunks = []
    embeddings = []

    for row in rows:
        chunk_text, emb_str = row
        emb = np.frombuffer(base64.b64decode(emb_str), dtype=np.float32)
        chunks.append(chunk_text)
        embeddings.append(emb)

    return chunks, embeddings


def query_with_bart_model_with_three_chucks(chunks, embeddings, query):
    query_embedding = model.encode(query)
    similarities = util.pytorch_cos_sim(query_embedding, embeddings)[0]
    
    # Get the indices of the top 3 most similar chunks
    top_k = 3
    top_k_indices = np.argpartition(-similarities, top_k)[:top_k]

    # Sort the top_k indices by similarity in descending order
    top_k_indices = top_k_indices[np.argsort(-similarities[top_k_indices])]

    # Get the top 3 closest chunks
    closest_chunks = [chunks[idx] for idx in top_k_indices]

    # Construct the input text using the top 3 closest chunks
    input_text = f"Question: {query} Context: {closest_chunks[0]} {closest_chunks[1]} {closest_chunks[2]}"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)

    # Generate the summary
    summary_ids = bart_model.generate(
        inputs['input_ids'].to('cuda') if torch.cuda.is_available() else inputs['input_ids'],
        max_length=150, num_beams=4, length_penalty=2.0, early_stopping=True
    )

    response = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return response

def query_with_bart_model_with_one_chunk(chunks, embeddings, query):
    """Generates a query result using the BART model based on the closest chunk embeddings."""
    

    query_embedding = model.encode(query)
    similarities = util.pytorch_cos_sim(query_embedding, embeddings)[0]

    most_similar_idx = np.argmax(similarities)
    most_similar_chunk = chunks[most_similar_idx]

    input_text = f"Question: {query} Context: {most_similar_chunk}"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)

    summary_ids = bart_model.generate(inputs['input_ids'].to('cuda') if torch.cuda.is_available() else inputs['input_ids'],
                                     max_length=150, num_beams=4, length_penalty=2.0, early_stopping=True)

    response = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return response

def connect_to_database(db_file):
    """Connects to the SQLite database."""
    conn = sqlite3.connect(db_file)
    return conn

@app.post("/query")
async def get_response(query: Query):
    try:
        conn = connect_to_database('final.db')
        chunks, embeddings = retrieve_embeddings_from_db(conn)
        result = query_with_bart_model_with_three_chucks(chunks, embeddings, query.query)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
