const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const connection = require('../config/db.js');

const router = express.Router();

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register.html'));
});

router.post('/register', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if (username && password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        connection.query('INSERT INTO `accounts` (`username`, `password`, `email`) VALUES (?, ?, ?)', [username, hashedPassword, email], (error) => {
            if (error){
                res.redirect('/register');
            }
            else{
                res.redirect('/login');
            }
        });
    }
});



module.exports = router;