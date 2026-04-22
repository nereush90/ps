# Document Scanning Web App — Technical Documentation (MVP)

## Overview

A minimal MVP web application for scanning and processing documents using a mobile web browser (Safari on iPhone). The system allows a small group of users (5–10 people) to capture document images, classify them, extract key data, and store both the image and structured metadata in a backend running on Google Cloud Platform (GCP).

**Design goals:**
- Simple to implement
- Low-cost
- Easy to maintain
- Scalable when needed

---

## User Flow

```
1. User opens the web app in Safari on iPhone
2. User takes a photo of a document (or selects from gallery)
3. Image is uploaded to the backend
4. Backend processes the image:
   - Classifies document type (invoice, receipt, other)
   - Extracts key fields (date, amount, issuer, etc.)
5. Image is stored in Cloud Storage
6. Extracted data is stored in Firestore
7. User sees the result in the app
```

---

## Architecture

```
iPhone Safari → Web App → Cloud Run API → Cloud Storage + Vertex AI → Firestore → Response to user
```

---

## Frontend

**Technology:** Simple SPA (React or plain JS), runs in Safari — no native app required.

**Camera input:**
```html
<input type="file" accept="image/*" capture="environment">
```

**Features:**
- Take photo or upload image from gallery
- Show processing status
- Display extracted document data
- Optional: list of past scanned documents

---

## Backend (GCP Services)

### Cloud Run
- Hosts the backend API (Node.js or Python)
- Handles image uploads and processing logic
- Fully managed, no servers to operate

### Cloud Storage
- Stores original document images
- Simple bucket structure

### Firestore (NoSQL)
- Stores document metadata and extracted fields
- Flexible schema — well suited for MVP

---

## AI Processing

**Approach for MVP:** Vertex AI (Gemini) only — reduces complexity and cost.

| Step | Service | Purpose |
|------|---------|---------|
| Classification | Vertex AI (Gemini) | Identify document type |
| Field extraction | Vertex AI (Gemini) | Extract structured data from image |
| (Future) Higher accuracy | Document AI | Invoices and receipts only |

---

## Backend Processing Flow

```
1. Receive image upload
2. Save image to Cloud Storage
3. Create Firestore record  →  status: "processing"
4. Send image to Vertex AI
5. Parse AI response into structured JSON
6. Update Firestore record:
   - documentType
   - extracted fields
   - confidence (optional)
   - status: "done"
```

> **MVP note:** Everything is synchronous — no queues or async pipelines.

---

## Data Model (Firestore)

```json
{
  "id": "doc_001",
  "createdAt": "timestamp",
  "status": "done",
  "fileUrl": "gs://bucket/path/image.jpg",
  "documentType": "invoice",
  "fields": {
    "date": "2026-04-20",
    "total": 123.45,
    "vendor": "Example Ltd"
  }
}
```

---

## Design Principles

- Keep everything synchronous for MVP
- Avoid queues and complex pipelines
- Single backend service only
- Prefer fully managed GCP services
- Optimize for simplicity over scalability

---

## Estimated Costs (5–10 users)

| Service | Cost level | Notes |
|---------|-----------|-------|
| Cloud Run | Very low | Low traffic at small scale |
| Cloud Storage | Minimal | Images only |
| Firestore | Low | Low read/write volume |
| Vertex AI | Main cost driver | Pay per request |

Overall cost remains low at MVP scale.

---

## Future Extensions (Out of MVP Scope)

- Async processing via Cloud Tasks
- Document AI for higher accuracy on invoices/receipts
- User authentication (Firebase Auth)
- Export to accounting systems
- Search and filtering UI

---

## Summary

This MVP delivers core document scanning value quickly with minimal infrastructure and cost. The architecture is designed so it can be expanded later without major redesign.
