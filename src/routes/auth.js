const router = require("express").Router();
const phin = require("phin");
const { getUserInfo } = require("../discord/api_call.js");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { request } = require("express");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const discord_token_url = "https://discord.com/api/oauth2/token";
const discord_token_revoke_url = "https://discord.com/api/oauth2/token/revoke";

async function get_access_token(accessCode, origin) {
    try {
        const requests = await phin({
            method: "POST",
            url: discord_token_url,
            parse: "json",
            form: {
                client_id: client_id,
                client_secret: client_secret,
                grant_type: "authorization_code",
                code: accessCode,
                redirect_uri: origin,
                scope: "identify guilds relationships.read",
            },
        });
        if (requests.statusCode === 200) {
            return requests.body;
        } else return undefined;
    } catch (e) {
        return undefined;
    }
}

async function revoke_access_token(token) {
    try {
        const requests = await phin({
            method: "POST",
            url: discord_token_revoke_url,
            parse: "json",
            form: {
                client_id: client_id,
                client_secret: client_secret,
                token: token,
            },
        });

        if (requests.statusCode === 200) {
            return requests.body;
        } else {
            console.log(request.body);
            return undefined;
        }
    } catch (e) {
        return undefined;
    }
}

// DEV LOGIN
router.get("/dev/discord", async (req, res) => {
    code = req.query.code;
    if (code == undefined || code == "")
        return res
            .status(403)
            .send({ msg: "No code provided, authorization denied" });
    const user_tokens = await get_access_token(code, "http://localhost:3000/auth/dev/discord");
    if (user_tokens === undefined)
        return res.status(416).send({ msg: "Content is not acceptable" });
    userData = await getUserInfo(user_tokens.access_token);
    let users = await db.select_all("global_data", "user", {
        _id: userData.id.toString(),
    });
    let account = {
        _id: userData.id.toString(),
        linked: [],
        badges: [],
        creation: Date.now(),
        visible: false,
        age: null,
        sex: null,
    };
    if (users.length == 0) db.insert_obj("global_data", "user", account);
    let token = jwt.sign(
        {
            token: user_tokens.access_token,
            refresh_token: user_tokens.refresh_token,
            discord_id: userData.id,
        },
        process.env.SECRET
    );
    return res.status(200).send({ token: token });
});

router.post("/discord", async (req, res) => {
    code = req.query.code;
    if (code == undefined || code == "")
        return res
            .status(403)
            .send({ msg: "No code provided, authorization denied" });
    const user_tokens = await get_access_token(code, req.header("origin"));
    if (user_tokens === undefined)
        return res.status(416).send({ msg: "Content is not acceptable" });
    userData = await getUserInfo(user_tokens.access_token);
    let users = await db.select_all("global_data", "user", {
        _id: userData.id.toString(),
    });
    let account = {
        _id: userData.id.toString(),
        linked: [],
        blocked: [],
        badges: [],
        creation: Date.now(),
        visible: false,
        age: null,
        sex: null,
    };
    if (users.length == 0) db.insert_obj("global_data", "user", account);
    let token = jwt.sign(
        {
            token: user_tokens.access_token,
            refresh_token: user_tokens.refresh_token,
            discord_id: userData.id,
        },
        process.env.SECRET
    );
    return res.status(200).send({ token: token });
});

router.post("/discord/logout", async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader === undefined)
        return res.status(403).send({ msg: "You must be connected before logout" });
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, process.env.SECRET, (error, authData) => {
        if (error) return res.status(401).send({ msg: "Token is not valid" });
        console.log(authData);
        if (authData.token === undefined)
            return res.status(403).send({ msg: "No token, authorization denied" });
        revoke_access_token(authData.token);
        return res.status(200).send({ msg: "logout success" });
    });
});

module.exports = router;