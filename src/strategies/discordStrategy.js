const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify' ,'guilds'],
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile.id);
    done(null, profile);
}))


