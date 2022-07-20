const api_endpoint = "https://discord.com/api/v10/";
const TOKEN = process.env.TOKEN;

async function getBotGuilds(){
    const response = await fetch(api_endpoint + 'users/@me/guilds', {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getGuildWidget(guild_id){
    const response = await fetch(api_endpoint + 'guilds/'+ guild_id + '/members', {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getGuildInfo(guild_id){
    const response = await fetch(api_endpoint + 'guilds/'+ guild_id, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getGuildChannels(guild_id){
    const response = await fetch(api_endpoint + 'guilds/'+ guild_id + "/channels", {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getChannelMessages(channel_id){
    const response = await fetch(api_endpoint + 'channels/' + channel_id, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getChannelMessage(channel_id, message_id){
    const response = await fetch(api_endpoint + 'channels/' + channel_id + "/messages/" + message_id, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getGuildRoles(guild_id){
    const response = await fetch(api_endpoint + 'guilds/'+ guild_id + "/roles", {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getGuildUsers(guild_id){
    const response = await fetch(api_endpoint + 'guilds/'+ guild_id + "/members", {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}
async function getGuildUser(guild_id, user_id){
    const response = await fetch(api_endpoint + 'guilds/'+ guild_id + "/members/" + user_id, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getGuildBans(guild_id){
    const response = await fetch(api_endpoint + 'guilds/'+ guild_id + "/bans", {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}
async function getGuildBan(guild_id, user_id){
    const response = await fetch(api_endpoint + 'guilds/'+ guild_id + "/bans/" + user_id, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });
    return response.json();
}

async function getUserGuild(user_token){
    const response = await fetch(api_endpoint + 'users/@me/guilds', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${user_token}`
        }
    });
    return response.json();
}

async function getUserInfo(user_token){
    const response = await fetch(api_endpoint + 'users/@me', {
        method: 'GET',
        headers:{
            Authorization: `Bearer ${user_token}`
        }
    });
    return response.json();
}

module.exports = { getUserInfo, getBotGuilds, getUserGuild, getGuildWidget, getGuildInfo, getGuildChannels, getChannelMessages, getChannelMessage, getGuildRoles, getGuildUsers, getGuildUser, getGuildBans, getGuildBan };