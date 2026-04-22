'use strict';

const { Router } = require('express');
const multer = require('multer');
const { uploadImage } = require('../services/storage');
const { createDocument, updateDocument, getDocument, listDocuments } = require('../services/firestore');
const { analyzeImage, parseAIResponse } = require('../services/vertexai');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/documents', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided.' });
  }

  let docId;
  try {
    const fileUrl = await uploadImage(req.file);

    const doc = await createDocument({ fileUrl });
    docId = doc.id;

    const rawResponse = await analyzeImage(fileUrl);
    const { documentType, fields } = parseAIResponse(rawResponse);

    const updated = await updateDocument(docId, { status: 'done', documentType, fields });
    return res.status(201).json(updated);
  } catch (err) {
    if (err.code === 'INVALID_FILE_TYPE' || err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: err.message });
    }
    if (docId) {
      await updateDocument(docId, { status: 'error' }).catch(() => {});
    }
    console.error(err);
    return res.status(500).json({ error: 'Processing failed.' });
  }
});

router.get('/documents/:id', async (req, res) => {
  try {
    const doc = await getDocument(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found.' });
    return res.json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to retrieve document.' });
  }
});

router.get('/documents', async (_req, res) => {
  try {
    const docs = await listDocuments();
    return res.json(docs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to retrieve documents.' });
  }
});

module.exports = router;
