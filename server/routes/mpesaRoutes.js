const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { parseMpesa } = require('../controllers/mpesaController');

router.post('/parse', protect, parseMpesa);

module.exports = router;
