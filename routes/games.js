const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/games', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/games.html'));
});

module.exports = router;