const router = require('express').Router();


function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('/');
}

router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user, logged: !!req.user});
})

router.get('/settings' , isAuthenticated, (req, res) => {
    res.sendStatus(200)
})

module.exports = router;