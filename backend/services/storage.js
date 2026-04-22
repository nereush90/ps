'use strict';

const { Storage } = require('@google-cloud/storage');
const { randomUUID } = require('crypto');
const config = require('../src/config');

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const storage = new Storage({ projectId: config.gcpProjectId });
const bucket = storage.bucket(config.storageBucket);

async function uploadImage(file) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const err = new Error('Invalid file type. Only JPEG and PNG are allowed.');
    err.code = 'INVALID_FILE_TYPE';
    throw err;
  }
  if (file.size > MAX_FILE_BYTES) {
    const err = new Error('File too large. Maximum size is 10 MB.');
    err.code = 'FILE_TOO_LARGE';
    throw err;
  }

  const ext = file.mimetype === 'image/jpeg' ? 'jpg' : 'png';
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;

  await bucket.file(filename).save(file.buffer, { contentType: file.mimetype });

  return `gs://${config.storageBucket}/${filename}`;
}

module.exports = { uploadImage };
