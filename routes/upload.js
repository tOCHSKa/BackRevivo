const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ctrl = require('../controllers/uploadController');
const rateLimit = require('express-rate-limit');
const optionalAuth = require('../middleware/optionalAuth');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
});


router.post('/', uploadLimiter, upload.single('file'), ctrl.upload);

module.exports = router;
