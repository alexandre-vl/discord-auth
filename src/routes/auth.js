const router = require('express').Router();
const passport = require('passport');

router.get('/' , passport.authenticate('discord'));
router.get('/redirect', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
    res.sendStatus(200)
});
module.exports = router;