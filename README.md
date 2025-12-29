<p align="center">
  <img src="creativevault-production/src/creative_vault_frontend/src/pmlogo-2.png" alt="ProofMint Logo" width="200"/>
</p>

<h1 align="center">ProofMint - Securing Creativity with Technology</h1>

Proof Mint is a decentralized, AI-powered proof-of-authorship engine that allows innovators to permanently timestamp and protect their creative ideas on the **Internet Computer (ICP)** blockchain. From text and code to sketches and startup concepts—users can safeguard their originality with a soulbound NFT minted only after a semantic originality check.

---
(Know about ProofMint in 1 click! - [https://proofmint.tiiny.site])
---

## 🚀 Core Features

### 🔍 Semantic Originality Analysis
- **NLP-Powered:** Analyzes idea titles and descriptions using a dedicated FastAPI microservice.
- **Portfolio Comparison:** Compares new submissions against the user’s **own previously submitted ideas**.
- **Risk Scoring:** Generates a Similarity Score (0–100) and assigns a risk level (**LOW / MEDIUM / HIGH**).
- **Automated Guardrails:** Automatically **blocks submission** if the risk level is **HIGH**.

### ⛓️ Blockchain-Verified Proof
- **On-Chain Storage:** Ideas are stored permanently in a Motoko canister.
- **Immutable Metadata:** Records the Creator Principal, Timestamp, Cryptographic Proof Hash, and Semantic Report.
- **Tamper-Proof:** Ensures verifiable authorship that cannot be backdated or altered.

### 🔐 Access Control
- **Visibility Options:** Public, Private, or Reveal-later.
- **Sovereignty:** Only creators can modify or reveal their private ideas.

### 🤝 Collaboration Support
- **Multi-Signature:** Support for collaborative ideas with multiple owners.
- **Governance:** Configurable approval thresholds and on-chain signature tracking.

---

## 🧱 Architecture Overview

ProofMint uses a decoupled architecture where the frontend orchestrates communication between the AI analysis layer and the Blockchain storage layer.

```text
       [ USER ]
          │
          ▼
  [ React Frontend ]  <───────>  [ FastAPI NLP Service ]
          │                        (Analyze Semantics)
          │
          ▼
   < RISK CHECK >
    │          │
    │ (High)   │ (Low)
    ▼          ▼
 [ Block ]  [ ICP Motoko Canister ]
                       │
                       ▼
               [ Stable Storage ]
```
---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
| :--- | :--- |
| **React + Vite** | High-performance UI framework |
| **Tailwind CSS** | Styling and responsive design |
| **Zustand** | State management |
| **@dfinity/agent** | ICP Blockchain integration |

### Backend (Blockchain)
| Tech | Purpose |
| :--- | :--- |
| **Motoko** | Smart Contract (Canister) language |
| **Stable Storage** | Persists data across canister upgrades |
| **Internet Identity** | Principal-based authentication |

### NLP Microservice
| Tech | Purpose |
| :--- | :--- |
| **FastAPI** | Python API framework |
| **NLP Models** | Semantic similarity analysis logic |

---

## 📂 Project Structure

```text
creativevault-production/
├── src/
│   ├── creative_vault_frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── IdeaSubmission.jsx
│   │   │   │   ├── IdeaCard.jsx
│   │   │   │   └── PublicFeed.jsx
│   │   │   ├── store/
│   │   │   │   ├── authStore.js
│   │   │   │   └── ideaStore.js
│   │   │   └── services/
│   │   │       └── semanticApi.js
│   │   └── index.html
│   ├── idea_vault/
│   │   └── main.mo  <-- Motoko Backend
│   └── declarations/
├── generated-image.jpg  <-- Place logo here
├── dfx.json
├── package.json
└── README.md
```
---
## 🧪 Local Development Setup

Follow these steps to run the full stack locally.

### 1. Prerequisites
* Node.js (v18+)
* Python (v3.9+)
* DFX SDK (Internet Computer)

### 2. Start ICP Local Replica
Start the local blockchain environment.
```bash
dfx start --clean
```

### 3. Deploy Canisters
Deploy the Motoko backend and frontend assets to the local replica.
```bash
dfx deploy
```

### 4. Start NLP Service
Open a new terminal to run the Python backend.
```bash
cd proofmint-nlp
# Create virtual env if not exists
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

### 5. Run Frontend
If you want to run the frontend in hot-reload mode (separate from the canister).
```bash
npm install
npm run start
```
#### Access the App at: http://localhost:3000

---

## 🧠 Semantic Analysis Logic

The system prevents redundancy by analyzing the semantic distance between the new idea and the user's existing portfolio.

**Input:**
* New Idea Title & Description
* List of User’s Existing Ideas

**Output Example:**
```json
{
  "similarity_score": 0.23,
  "risk_level": "LOW",
  "message": "No significant similarity detected"
}
```
#### Blocking Logic: If risk_level === "HIGH", the frontend disables the "Mint Proof" button.

---

## 🔒 Security & Integrity

- Timestamping: On-chain timestamps prevent backdating of ideas.
- Authorization: Principal-based checks ensure only owners can access private data.
- Upgrade Safety: Uses Motoko Stable variables to ensure no data is lost during code updates.

---

## 🌱 Future Enhancements

[1] Global Corpus: Opt-in comparison against the global database of ideas.

[2] Advanced Models: Integration with larger embedding models for deeper context.

[3] Disputes: DAO-based dispute resolution mechanism.

[4] NFTs: Minting proof certificates as NFTs.

[5] IPFS: Support for attaching PDF/Doc documents.

---

## 👩‍💻 Author
- Shambhavi Raj
- Shardul Bangale
   
#### "Blockchain • AI • Full-Stack Built for originality protection and ethical innovation"

---

## 📜 License
This project is licensed under the MIT License.
