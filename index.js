const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const TOKEN = config.token;

client.on("ready", () => {
    console.log("This bot is online");
})

client.on("message", msg => {
    switch(msg.content){
        case "HELLO":
            msg.reply("Hello World");
            break;    
        case "speech":
            msg.channel.send("Text to speech works!", { tts: true });
            break;
        default:
    }
})

client.login(TOKEN);






