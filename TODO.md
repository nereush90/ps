# TODO — Document Scanning Web App (MVP)

Task list for building the MVP. Work top-to-bottom within each section.

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
