'use strict';

const path = require('path');
const config = require('./config');
const express = require('express');
const cors = require('cors');
const healthRouter = require('../routes/health');
const documentsRouter = require('../routes/documents');

const app = express();

if (config.corsOrigin) {
  app.use(cors({ origin: config.corsOrigin }));
}

app.use(express.json());
app.use(healthRouter);
app.use(documentsRouter);

const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
