const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'secret key',
    resave: false,
}));  
app.use(express.urlencoded({ extended: true }));
const weather = require('./handlers/main');
app.use(weather);
const logout = require('./handlers/logout')
app.use(logout);
const login = require('./handlers/login');
app.use(login);
const adminhandlers = require('./handlers/admin');
app.use(adminhandlers);
const register = require('./handlers/register');
app.use(register);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
