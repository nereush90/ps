'use strict';

require('dotenv').config();

const required = ['GCP_PROJECT_ID', 'STORAGE_BUCKET', 'VERTEX_AI_MODEL', 'FIRESTORE_COLLECTION'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  gcpProjectId: process.env.GCP_PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  vertexAiModel: process.env.VERTEX_AI_MODEL,
  vertexAiLocation: process.env.VERTEX_AI_LOCATION || 'us-central1',
  firestoreCollection: process.env.FIRESTORE_COLLECTION,
  corsOrigin: process.env.CORS_ORIGIN || '',
  port: parseInt(process.env.PORT || '8080', 10),
};
