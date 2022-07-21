require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const passport = require('passport');
const discordStrategy = require('./strategies/discordStrategy');
const db = require('./database/database');
const path = require('path');

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
    name:"discord.oauth2",
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);

app.get('/', (req, res) => {
    res.render('home', { users: [
        { name: 'John Doe', email: 'john.doe@gmail.com'},
            {name:'Mark', email: 'mark@gmail.com'},
        ] });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});