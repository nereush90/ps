# CLAUDE.md — Agent Guidelines for Document Scanning Web App (MVP)

## Project Summary

This is an MVP web application for scanning and processing documents via Safari on iPhone.
Stack: React/plain JS frontend · Cloud Run API (Node.js or Python) · Cloud Storage · Firestore · Vertex AI (Gemini).

See `README.md` for full architecture and data model details.

---

## Core Rules

### 1. MVP First — No Over-Engineering
- Implement only what is described or explicitly requested.
- Do not add queues, caching layers, complex pipelines, or extra abstractions.
- Do not introduce authentication, search, or export features until they are requested.
- Three similar lines of code are better than a premature abstraction.

### 2. Synchronous Processing Only
- The backend flow is fully synchronous: upload → Cloud Storage → Vertex AI → Firestore → response.
- Do not introduce async workers, Cloud Tasks, or Pub/Sub unless explicitly asked.

### 3. Single Backend Service
- All backend logic lives in one Cloud Run service.
- Do not split into microservices or separate functions without explicit instruction.

### 4. Managed GCP Services Only
- Use Cloud Run, Cloud Storage, Firestore, and Vertex AI.
- Do not introduce self-managed databases, VMs, or Kubernetes.

### 5. AI via Vertex AI (Gemini) Only
- For MVP, use Vertex AI for both document classification and field extraction.
- Do not add Document AI unless the user explicitly requests higher accuracy for specific document types.

---

## Code Style

- **No unnecessary comments.** Add a comment only when the *why* is non-obvious (hidden constraint, workaround, subtle invariant).
- **No docstrings** beyond a single short line where strictly necessary.
- **No dead code.** Remove unused variables, imports, and functions immediately.
- **No backwards-compatibility shims** unless explicitly required.
- Keep functions small and focused on one responsibility.
- Validate input only at system boundaries (HTTP handler, file upload). Trust internal code.

---

## File & Folder Conventions

```
/frontend        React (or plain JS) SPA
/backend         Cloud Run API (Node.js or Python)
  /routes        HTTP route handlers
  /services      Cloud Storage, Firestore, Vertex AI clients
README.md        Architecture and technical documentation
CLAUDE.md        Agent guidelines (this file)
```

---

## Firestore Data Model

Always follow the canonical document schema:

```json
{
  "id": "doc_001",
  "createdAt": "timestamp",
  "status": "processing | done | error",
  "fileUrl": "gs://bucket/path/image.jpg",
  "documentType": "invoice | receipt | other",
  "fields": {
    "date": "YYYY-MM-DD",
    "total": 0.00,
    "vendor": "string"
  }
}
```

- Do not add fields to this schema without explicit instruction.
- `status` must always be set to `"processing"` before calling Vertex AI, then updated to `"done"` or `"error"`.

---

## Security

- Never log or store raw image data in Firestore — use Cloud Storage URLs only.
- Never expose GCP service account keys in code or environment files committed to the repository.
- Validate file type and size at the upload boundary (backend route handler).
- Do not introduce user-facing error messages that leak internal implementation details.

---

## GCP & Deployment

- Cloud Run service must be stateless — no local file writes between requests.
- Store all images in Cloud Storage before any processing.
- Use environment variables for all GCP project IDs, bucket names, and Vertex AI model IDs.
- Do not hardcode resource names or regions in application code.

---

## Git Workflow

- Work on feature branches; never push directly to `main`.
- Write clear, descriptive commit messages focused on *why*, not *what*.
- Do not commit `.env` files, service account JSON keys, or any secrets.

---

## What NOT to Build (MVP Scope Boundary)

| Feature | Status |
|---------|--------|
| Async processing (Cloud Tasks) | Out of scope |
| Document AI integration | Out of scope |
| User authentication (Firebase Auth) | Out of scope |
| Export to accounting systems | Out of scope |
| Search and filtering UI | Out of scope |

If a user requests any of the above, confirm intent before implementing.

---

## Change Checklist

Before finishing any task, verify:

- [ ] No new services or infrastructure added beyond the current MVP stack
- [ ] Firestore schema unchanged (or change was explicitly requested)
- [ ] No secrets or credentials in committed files
- [ ] No unused code left behind
- [ ] Backend remains stateless and synchronous
