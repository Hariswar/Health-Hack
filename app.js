const express = require('express');
const session = require('express-session');
const path = require('path');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const gameboardRoute = require('./routes/gameboard');

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', gameboardRoute);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, './views/404.html'));
  });

console.log('Server running at http://localhost:4000/');
app.listen(4000);
