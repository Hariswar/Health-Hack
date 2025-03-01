const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/error', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../views/error.html'));
});

module.exports = router;