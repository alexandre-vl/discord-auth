const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../models/DiscordUser');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    const user = DiscordUser.findById(id);
    if (user)
        done(null, user);

});

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify' ,'guilds'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await DiscordUser.findOne({id: profile.id})
        if (user)
            done(null, user);
        else {
            const newUser = await DiscordUser.create({
                id: profile.id,
                username: profile.username,
            })
            const savedUser = await newUser.save();
            done(null, savedUser);
        }
    }catch (err) {
        console.log(err);
        done(err, null);
    }
}))


