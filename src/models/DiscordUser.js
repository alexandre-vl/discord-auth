const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    discriminator: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    guilds: {type: Array, required: true},
})

const DiscordUser = module.exports = mongoose.model('User', UserSchema);