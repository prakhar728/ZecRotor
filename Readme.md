# ZecRotor Agent (MVP)

## 🚀 Overview
**ZecRotor** is an experimental **Shade Agent–powered job scheduler** for automated token rotation.  

It allows users to submit a “job” that describes **how, when, and where funds should move**. At the scheduled time, the agent executes the outgoing transaction.  

This MVP is the first step toward a system that can:  
- Swap tokens across chains  
- Shield/unshield assets (e.g., via Zcash)  
- Disperse funds to a final destination  
- Preserve **privacy** by abstracting flows through an autonomous agent  

---

## ⚙️ How It Works
1. **User submits a job** with:  
   - `sender_address` → the origin of funds  
   - `sending_token` → the token being deposited  
   - `destination_address` → the final recipient  
   - `destination_token` → the token to send out  
   - `execute_at_epoch` → when the transaction should execute  
    - Refer to [job.ts](https://github.com/prakhar728/ZecRotor/blob/main/src/routes/jobs.ts#L58) to understand how it works.

2. **Agent generates a deposit address** and stores the job in memory.  
 - The memory is a simple [JS - TS array](https://github.com/prakhar728/ZecRotor/blob/main/src/state.ts#L29). 

3. **Background scheduler** (runs every minute):  
   - Watches the deposit address for incoming funds   -  [Method definition schedular.ts](https://github.com/prakhar728/ZecRotor/blob/main/src/scheduler.ts#L8)
   - If funds are confirmed → move job status from ['PENDING_DEPOSIT'](https://github.com/prakhar728/ZecRotor/blob/main/src/scheduler.ts#L20) to ['PENDING'](https://github.com/prakhar728/ZecRotor/blob/main/src/scheduler.ts#L42).  
   - Waits until `execute_at_epoch` → processes the job  this [logic](https://github.com/prakhar728/ZecRotor/blob/main/src/scheduler.ts#L59)
   - Currently produces a **fake transaction** for testing  

4. **Job lifecycle tracking**:  
   - `PENDING_DEPOSIT → FUNDED → PROCESSING → COMPLETED | FAILED`  
   - Each job includes an **event log** with timestamps and context  

---

### I wanted to highlight that the entire MVP exists on Mainnet, not testnet. Since it's not audited and still has security issues we can deploy it on the cloud and phala.


## ✨ Features (MVP)
- 🚀 Simple REST API for job creation and tracking  
- 🕑 Minute-level scheduler (cron-style loop)  
- 🗂 In-memory job storage (no DB required)  
- 🎭 Fake transaction execution for testing flows  
- 📝 Event log per job for transparency  
- 🧪 Optional deposit simulation endpoint  

---

## 📌 Example Usage

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

**Response**
```json
{
  "job_id": "uuid-1234",
  "deposit_address": "demo-deposit-xxxx-123456",
  "execute_at_epoch": 1696156800,
  "status": "PENDING_DEPOSIT"
}
```

---

### 2. Check Job Status
```http
GET /api/jobs/{job_id}
```

**Response**
```json
{
  "job_id": "uuid-1234",
  "status": "COMPLETED",
  "events": [
    { "ts_epoch": 1696156700, "type": "JOB_CREATED" },
    { "ts_epoch": 1696156750, "type": "DEPOSIT_CONFIRMED" },
    { "ts_epoch": 1696156800, "type": "TX_SUBMITTED_FAKE", "payload": { "tx_id": "fake_uuid_1696156800" } }
  ]
}
```

---

### 3. (Optional) Simulate a Deposit
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
- ✅ In-memory job scheduler (fake transactions)  
- 🚧 Persistent storage (DB support)  
- 🚧 Real blockchain deposit detection  
- 🚧 Swap execution (Uniswap/DEX integration)  
- 🚧 Webhook / notification support  
- 🚧 Privacy-preserving rotation with Zcash shielding/unshielding  

---

## 📖 License
This project is an **MVP prototype** and intended **for research and experimental use only**.  
