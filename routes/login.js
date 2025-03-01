const express = require('express'); 
const path = require('path');
const bcrypt = require("bcrypt");
const connection = require('../config/db.js');

const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    connection.query('SELECT * FROM accounts WHERE username = ?', [username], async function(error, results) {
      if (results.length > 0) {
        const user = results[0];
        try {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            req.session.loggedin = true;
            req.session.username = username;
            return res.redirect('/gameboard'); // Successfully logged in, redirect to gameboard
          } else {
            return res.redirect('/login'); // Incorrect password, redirect to login
          }
        } catch (err) {
          return res.redirect('/login'); // Incorrect password, redirect to login
        }
      } else {
        return res.redirect('/login'); // Incorrect password, redirect to login
      }
    });
  } else {
    return res.redirect('/login'); // Incorrect password, redirect to login
  }
});

module.exports = router;
