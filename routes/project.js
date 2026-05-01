const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const projectController = require('../controllers/projectController');

router.get('/me', auth, projectController.getMyProjects);

module.exports = router;