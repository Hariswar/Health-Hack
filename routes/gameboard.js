const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/gameboard', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, '../views/gameboard.html'));
    } else {
        res.redirect('/login');
    }
});

module.exports = router;