'use strict';

const config = require('./config');
const express = require('express');
const healthRouter = require('../routes/health');
const documentsRouter = require('../routes/documents');

const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(documentsRouter);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
