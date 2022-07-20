require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const passport = require('passport');
const discordStrategy = require('./strategies/discordStrategy');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const authRoute = require('./routes/auth');

app.use(session({
    secret: process.env.CLIENT_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    saveUninitialized: false,
}));

// Passport

app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute);

app.get('*', (req, res) => {
    res.send('Not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});