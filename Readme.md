# ZecRotor Agent MVP

## 🚀 Overview
ZecRotor is an experimental **agent-based job scheduler for token rotation**.  
It allows users to submit a “job” with simple instructions about how and when their funds should move.  

At the scheduled time, the agent executes (or fakes for now) the outgoing transaction.  
This MVP forms the foundation for a system that can **swap tokens, shield/unshield them (e.g., on Zcash), and disperse to destination addresses** while keeping flows private.

---

## ⚙️ How It Works
1. **User submits a job** with:
   - `sender_address` – where funds come from  
   - `sending_token` – token being deposited  
   - `destination_address` – final recipient  
   - `destination_token` – token to be sent out  
   - `execute_at_epoch` – when the transaction should happen  

2. **Agent generates a deposit address** and stores the job in memory.  

3. **Background scheduler** runs every minute:
   - When `execute_at_epoch` is reached, the agent processes the job.  
   - Currently, it generates a **fake transaction** for testing.  

4. **Track job status**:
   - Jobs move through states: `PENDING → PROCESSING → COMPLETED/FAILED`.  
   - Each job has an **event log** (creation, deposit, processing, tx submitted).  

---

## ✨ Features (MVP)
- Simple REST API for creating & tracking jobs  
- Minute-accurate scheduler (cron-like loop)  
- In-memory storage (arrays/JSON, no DB needed)  
- Fake transactions to simulate execution  
- Event log per job for transparency  
- Optional fake deposit simulation endpoint  

---

## 📌 Example Flow

### 1. Create a Job
```http
POST /api/jobs
Content-Type: application/json

{
  "sender_address": "0xSENDER",
  "sending_token": "USDC",
  "destination_address": "zcash_or_any_addr",
  "destination_token": "ZEC",
  "execute_at_epoch": 1696156800
}
```

**Response:**
```json
{
  "job_id": "uuid-1234",
  "deposit_address": "demo-deposit-xxxx-123456",
  "execute_at_epoch": 1696156800,
  "status": "PENDING"
}
```

---

### 2. Check Job Status
```http
GET /api/jobs/{job_id}
```

**Response:**
```json
{
  "job_id": "uuid-1234",
  "status": "COMPLETED",
  "events": [
    { "ts_epoch": 1696156700, "type": "JOB_CREATED" },
    { "ts_epoch": 1696156800, "type": "TX_SUBMITTED_FAKE", "payload": { "tx_id": "fake_uuid_1696156800" } }
  ]
}
```

---

### 3. Optional: Simulate a Deposit
```http
POST /api/jobs/{job_id}/fake-deposit
Content-Type: application/json

{
  "from_address": "0xSENDER",
  "amount": "123.45",
  "token": "USDC"
}
```

---

## 🛣 Roadmap
- ✅ In-memory job scheduler (fake tx)  
- 🚧 Add persistence (database)  
- 🚧 Integrate real blockchain wallets / swap logic  
- 🚧 Add webhook notifications  
- 🚧 Enable privacy-preserving rotation with Zcash shield/unshield  

---

## 📖 License
This project is an MVP prototype and for experimental use only.
