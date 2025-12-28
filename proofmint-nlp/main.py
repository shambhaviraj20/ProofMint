from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer("all-MiniLM-L6-v2")

# 🔥 in-memory store of previous ideas
idea_corpus = []

class AnalyzeRequest(BaseModel):
    title: str
    description: str
    existing_texts: list[str] = []

# 1. Define noise words to ignore
STOP_WORDS = [
    "decentralized", "blockchain", "web3", "crypto", "protocol", 
    "platform", "system", "app", "application", "smart", "contract", 
    "token", "nft", "dao"
]

def clean_text(text: str):
    # Convert to lowercase
    text = text.lower()
    # Remove special chars
    text = re.sub(r'[^a-z0-9\s]', '', text)
    # Remove buzzwords
    words = text.split()
    filtered = [w for w in words if w not in STOP_WORDS]
    return " ".join(filtered)

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    # 2. Clean the input (Reverted the "Double Title" trick)
    clean_new = clean_text(req.title + " " + req.description)
    
    print(f"🔍 Raw Input: {req.title}")
    print(f"🧹 Cleaned Input: '{clean_new}'")

    if not req.existing_texts:
        # ... (keep existing logic) ...
        idea_corpus.append(req.title + " " + req.description) # Store original
        return { "similarity_score": 0, "risk_level": "LOW", "message": "First idea" }

    # 3. Clean the existing texts too (on the fly)
    clean_existing = [clean_text(t) for t in req.existing_texts]

    # 4. Compare CLEANED versions
    embeddings = model.encode([clean_new] + clean_existing)
    new_vec = embeddings[0].reshape(1, -1)
    old_vecs = embeddings[1:]

    sims = cosine_similarity(new_vec, old_vecs)[0]
    max_sim = float(np.max(sims))
    score = int(max_sim * 100)
    
    print(f"📊 CALCULATED SCORE: {score}%")

    # 5. Restore Balanced Thresholds
    if score >= 45:      
        risk = "HIGH"
        msg = "Critical similarity detected."
    elif score >= 25:
        risk = "MEDIUM"
        msg = "Moderate similarity."
    else:
        risk = "LOW"
        msg = "Idea appears unique."

    return {
        "similarity_score": score,
        "risk_level": risk,
        "message": msg
    }