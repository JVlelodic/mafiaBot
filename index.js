const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const axios = require("axios");

const TOKEN = config.token;
const URL = config.url;

client.login(TOKEN);

client.on("ready", () => {
    console.log("This bot is online");
})

client.on("message", async (msg) => {
    switch(msg.content){
        case "HELLO":
            msg.reply("Hello World");
            break;
        case "MAFIA":
            const server = msg.guild.channels;
            const townhall = await createChannel(server, "Townhall", "voice");
            const mafia = await createChannel(server, "Mafia", "voice");
        default:
    }
})

const createChannel = async (server, cName, cType) => {
    try{
        const res = await server.create(cName, {
            type: cType
        });
    } catch (error){
        console.error(erorr);
    }   
}