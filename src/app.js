require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const discordStrategy = require('./strategies/discordStrategy');
const db = require('./database/database');
const path = require('path');
const mongoose = require('mongoose');

db.then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log(err);
})

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');

app.use(session({
    secret: process.env.CLIENT_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    saveUninitialized: false,
    resave: false,
    name:"discord.oauth2",
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
    })
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);

app.get('/', (req, res) => {
    res.render('home', {user: req.user, logged: !!req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});