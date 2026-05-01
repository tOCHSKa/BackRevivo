// routes/generate.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/generateController');

router.post('/preview', controller.generatePreview);

module.exports = router;