'use strict';

const { VertexAI } = require('@google-cloud/vertexai');
const config = require('../src/config');

const vertexai = new VertexAI({ project: config.gcpProjectId, location: config.vertexAiLocation });

const PROMPT = `Analyze the document in this image. Respond with valid JSON only — no markdown, no explanation.

Use this exact structure:
{
  "documentType": "invoice" | "receipt" | "other",
  "fields": {
    "date": "YYYY-MM-DD",
    "total": 0.00,
    "vendor": "string"
  }
}

Rules:
- documentType must be exactly "invoice", "receipt", or "other"
- date must be ISO 8601 (YYYY-MM-DD) or null if not found
- total must be a number (not a string) or null if not found
- vendor must be a string or null if not found`;

function mimeTypeFromUrl(url) {
  if (url.endsWith('.png')) return 'image/png';
  return 'image/jpeg';
}

async function analyzeImage(imageUrl) {
  const model = vertexai.getGenerativeModel({ model: config.vertexAiModel });
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          { fileData: { mimeType: mimeTypeFromUrl(imageUrl), fileUri: imageUrl } },
          { text: PROMPT },
        ],
      },
    ],
  });
  return result;
}

function parseAIResponse(response) {
  const text = response.response.candidates[0].content.parts[0].text;
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    documentType: ['invoice', 'receipt', 'other'].includes(parsed.documentType)
      ? parsed.documentType
      : 'other',
    fields: {
      date: parsed.fields?.date ?? null,
      total: typeof parsed.fields?.total === 'number' ? parsed.fields.total : null,
      vendor: parsed.fields?.vendor ?? null,
    },
  };
}

module.exports = { analyzeImage, parseAIResponse };
