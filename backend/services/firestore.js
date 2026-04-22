'use strict';

const { Firestore, FieldValue } = require('@google-cloud/firestore');
const config = require('../src/config');

const db = new Firestore({ projectId: config.gcpProjectId });
const col = () => db.collection(config.firestoreCollection);

async function createDocument(data) {
  const ref = col().doc();
  const doc = {
    ...data,
    id: ref.id,
    createdAt: FieldValue.serverTimestamp(),
    status: 'processing',
  };
  await ref.set(doc);
  const snap = await ref.get();
  return snap.data();
}

async function updateDocument(id, fields) {
  const ref = col().doc(id);
  await ref.update(fields);
  const snap = await ref.get();
  return snap.data();
}

async function getDocument(id) {
  const snap = await col().doc(id).get();
  if (!snap.exists) return null;
  return snap.data();
}

async function listDocuments() {
  const snap = await col().orderBy('createdAt', 'desc').get();
  return snap.docs.map((d) => d.data());
}

module.exports = { createDocument, updateDocument, getDocument, listDocuments };
