# TODO — Document Scanning Web App (MVP)

Task list for building the MVP. Work top-to-bottom within each section.

---

## Session Plan

Six sessions covering all MVP tasks. Sessions 1–3 are strictly sequential (each builds on the previous). Session 4 (frontend) can begin in parallel with Session 3 once the API contract is agreed. Sessions 5–6 are sequential and depend on all prior sessions being complete.

| Session | Focus | Key Deliverables | Depends On |
|---------|-------|-----------------|------------|
| **S1** | Project Init & Backend Scaffold | Git repo, monorepo structure, `.env.example`, GCP APIs enabled, Node.js project, Dockerfile, `GET /health` | — |
| **S2** | Backend Data Services | Cloud Storage bucket + `uploadImage`, file validation, Firestore DB + `createDocument` / `updateDocument` / `getDocument` / `listDocuments` | S1 |
| **S3** | Backend AI + API Endpoints | Vertex AI client, `analyzeImage`, `parseAIResponse`, error handling, `POST /documents`, `GET /documents/:id`, `GET /documents` | S2 |
| **S4** | Frontend | React/JS scaffold, Upload View (camera, preview, loading, errors), Result View, optional History View | S1 (S3 for full integration) |
| **S5** | Deployment & Infrastructure | Service account + IAM roles, Cloud Run deploy, frontend hosting, CORS | S3 + S4 |
| **S6** | Testing, Validation & Security | iPhone Safari tests, classification tests, error-path tests, security hardening checklist | S5 |

### Session Detail

#### S1 — Project Init & Backend Scaffold
- Initialize git repository and set up `.gitignore`
- Create monorepo folder structure: `/frontend`, `/backend`
- Create `.env.example`
- Enable GCP APIs: Cloud Run, Cloud Storage, Firestore, Vertex AI
- Initialize Node.js (or Python) project in `/backend`, install dependencies
- Configure environment variables in app
- Add `Dockerfile`
- Add `GET /health` endpoint

#### S2 — Backend Data Services
- Create GCP Cloud Storage bucket
- Implement `uploadImage(file)` service
- Add file-type (JPEG/PNG) and size validation at upload boundary
- Create Firestore database (Native mode)
- Implement `createDocument`, `updateDocument`, `getDocument`, `listDocuments`

#### S3 — Backend AI Integration & API Endpoints
- Configure Vertex AI client with Gemini model
- Implement `analyzeImage(imageUrl)` and `parseAIResponse(response)`
- Handle AI errors → set Firestore status to `"error"`
- Implement `POST /documents` (full upload → Storage → Firestore → Vertex AI → response pipeline)
- Implement `GET /documents/:id` and `GET /documents`

#### S4 — Frontend Development
- Initialize React (or plain JS) SPA in `/frontend`, configure Vite/CRA
- Set up env variable for backend API URL
- Build Upload View: camera file input, image preview, POST request, loading indicator, error display
- Build Result View: document type + extracted fields, "Scan another" button
- *(Optional)* Build Document History View: fetch + display `GET /documents`

#### S5 — Deployment & Infrastructure
- Create service account with roles: `storage.objectAdmin`, `datastore.user`, `aiplatform.user`
- Build and push Docker image to Artifact Registry; deploy Cloud Run service (min instances = 0)
- Build frontend static assets; host on Cloud Storage static site or Firebase Hosting
- Configure CORS on backend for frontend origin

#### S6 — Testing, Validation & Security
- Test image upload from iPhone Safari (camera + gallery)
- Test classification: invoice, receipt, unrecognized document
- Verify Firestore record lifecycle and Cloud Storage object creation
- Test error paths: invalid file type, Vertex AI failure
- Security checklist: no credentials committed, no raw image in logs, no stack traces in responses, IAM least privilege confirmed

---

## 1. Project Setup

- [ ] Initialize git repository and set up `.gitignore` (node_modules, .env, service account keys)
- [ ] Create monorepo folder structure: `/frontend`, `/backend`
- [ ] Create `.env.example` with required environment variable names (no values)
- [ ] Set up GCP project and enable required APIs:
  - [ ] Cloud Run API
  - [ ] Cloud Storage API
  - [ ] Firestore API
  - [ ] Vertex AI API

---

## 2. Backend — Cloud Run API

### 2.1 Project Scaffold
- [ ] Initialize Node.js (or Python) project in `/backend`
- [ ] Install dependencies: HTTP framework (Express / FastAPI), GCP SDKs
- [ ] Configure environment variables: `GCP_PROJECT_ID`, `STORAGE_BUCKET`, `VERTEX_AI_MODEL`, `FIRESTORE_COLLECTION`
- [ ] Add `Dockerfile` for Cloud Run deployment
- [ ] Add basic health check endpoint `GET /health`

### 2.2 Cloud Storage Integration
- [ ] Create GCP Cloud Storage bucket
- [ ] Implement `uploadImage(file)` — saves uploaded file to bucket, returns `gs://` URL
- [ ] Validate file type (JPEG/PNG only) and file size limit at upload boundary

### 2.3 Firestore Integration
- [ ] Create Firestore database (Native mode)
- [ ] Implement `createDocument(data)` — creates record with `status: "processing"`
- [ ] Implement `updateDocument(id, fields)` — updates record with extracted data and `status: "done"` or `"error"`
- [ ] Implement `getDocument(id)` — fetches single document record
- [ ] Implement `listDocuments()` — fetches list of all document records (for history view)

### 2.4 Vertex AI Integration
- [ ] Configure Vertex AI client with Gemini model
- [ ] Implement `analyzeImage(imageUrl)` — sends image to Vertex AI, returns raw response
- [ ] Implement `parseAIResponse(response)` — extracts `documentType` and `fields` into structured JSON
- [ ] Handle AI errors gracefully (update Firestore status to `"error"` on failure)

### 2.5 Upload & Processing Endpoint
- [ ] Implement `POST /documents` route:
  1. Validate and receive image upload
  2. Save image to Cloud Storage
  3. Create Firestore record (`status: "processing"`)
  4. Send image to Vertex AI
  5. Parse AI response
  6. Update Firestore record (`status: "done"`, extracted fields)
  7. Return document record to client
- [ ] Implement `GET /documents/:id` route — return single document by ID
- [ ] Implement `GET /documents` route — return list of past documents

---

## 3. Frontend — Web App (SPA)

### 3.1 Project Scaffold
- [ ] Initialize React (or plain JS) project in `/frontend`
- [ ] Configure build tool (Vite or Create React App)
- [ ] Set up environment variable for backend API URL

### 3.2 Upload View
- [ ] Implement file input with camera support:
  ```html
  <input type="file" accept="image/*" capture="environment">
  ```
- [ ] Show image preview after selection
- [ ] Implement upload button — POST image to `/documents`
- [ ] Show loading/processing indicator while awaiting response
- [ ] Show error message if upload or processing fails

### 3.3 Result View
- [ ] Display returned document data after successful processing:
  - Document type
  - Extracted fields (date, total, vendor, etc.)
- [ ] Add "Scan another document" button to reset the view

### 3.4 Document History View (optional)
- [ ] Fetch and display list of past documents (`GET /documents`)
- [ ] Each list item shows: document type, date, vendor, status

---

## 4. GCP Infrastructure & Deployment

- [ ] Create service account with least-privilege roles:
  - `roles/storage.objectAdmin` (Cloud Storage)
  - `roles/datastore.user` (Firestore)
  - `roles/aiplatform.user` (Vertex AI)
- [ ] Deploy backend to Cloud Run:
  - [ ] Build and push Docker image to Artifact Registry
  - [ ] Deploy Cloud Run service with env vars and service account
  - [ ] Set minimum instances to 0 (cost optimization)
- [ ] Deploy frontend:
  - [ ] Build static assets
  - [ ] Host on Cloud Storage static website or Firebase Hosting
- [ ] Configure CORS on backend to allow frontend origin

---

## 5. Testing & Validation

- [ ] Test image upload from iPhone Safari (camera and gallery)
- [ ] Test document classification with invoice sample
- [ ] Test document classification with receipt sample
- [ ] Test document classification with unrecognized document
- [ ] Verify Firestore record is created and updated correctly
- [ ] Verify image is stored in Cloud Storage
- [ ] Test error path: invalid file type upload
- [ ] Test error path: Vertex AI failure (e.g. unsupported image)

---

## 6. Security Hardening

- [ ] Ensure no GCP credentials are committed to the repository
- [ ] Confirm backend does not log raw image data
- [ ] Confirm error responses do not expose internal stack traces
- [ ] Review IAM roles — confirm principle of least privilege

---

## Out of Scope (MVP)

These tasks are intentionally deferred. Do not implement until explicitly requested.

- [ ] ~~Async processing (Cloud Tasks / Pub/Sub)~~
- [ ] ~~Document AI integration~~
- [ ] ~~User authentication (Firebase Auth)~~
- [ ] ~~Export to accounting systems~~
- [ ] ~~Search and filtering UI~~
