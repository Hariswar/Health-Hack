const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/health', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/health.html'));
});

module.exports = router;