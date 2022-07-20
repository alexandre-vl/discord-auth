const jwt = require("jsonwebtoken");
const phin = require('phin');

async function refreshToken(refresh_token) {
    try{
        const requests = await phin({
            method: 'POST',
            url: discord_token_url,
            parse: 'json',
            form: {
                client_id: client_id,
                client_secret: client_secret,
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
            }
        });

        if (requests.statusCode === 200) {
            return requests.body;
        } else return undefined;
    }catch(e){
        return undefined;
    }
}

async function getDiscordBaseInfos(user_token) {
    try{
        const requests = await phin({
            url: 'https://discord.com/api/v10/users/@me',
            method: 'GET',
            parse: 'json',
            headers: {
                Authorization: 'Bearer ' + user_token.toString(),
            }
        });
        if (requests.statusCode === 200) {
            return requests.body;
        } else return undefined;
    }catch(e){
        console.log('Error: ' + e)
        return undefined;
    }
}

module.exports = (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== "undefined") {
            const bearerToken = bearerHeader.split(" ")[1];
            req.token = bearerToken;
            jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
                if (error) return res.status(401).send({ msg: "Token is not valid" });
                let discord_data = await getDiscordBaseInfos(authData.token);
                if (discord_data === undefined) return res.status(405).send({ msg: "Token may not be up to date"})
                if (req.body.id === '@me')
                    req.body.id = authData.discord_id;
                req.authData = authData;
                req.authData.discord_username = discord_data.username;
                req.authData.discord_avatar = discord_data.avatar;
                req.authData.discord_avatar_decoration = discord_data.avatar_decoration;
                req.authData.discord_public_flags = discord_data.public_flags;
                req.authData.discord_flags = discord_data.flags;
                req.authData.discord_banner = discord_data.banner;
                req.authData.discord_banner_color = discord_data.banner_color;
                req.authData.discord_accent_color = discord_data.accent_color;
                req.authData.discord_locale = discord_data.locale;
                req.authData.discord_premium_type = discord_data.discord_premium_type;
                next();
            });
        } else {
            return res.status(403).send({ msg: "No token, authorization denied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal server error" });
    }
};