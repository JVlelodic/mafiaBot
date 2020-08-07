const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const { default: axios } = require("axios");

const TOKEN = config.token;
const URL = config.url;

let gChannels = [];

client.login(TOKEN);

client.on("ready", () => {
    console.log("This bot is online");
});

client.on("message", async (msg) => {
    switch (msg.content) {
        case "MAFIA":
            try {
                const server = msg.guild.channels;
                const townhall = await server.create("Townhall", {
                    type: "voice",
                });
                const mafia = await server.create("Mafia", { type: "voice" });
                gChannels.push(townhall);
                gChannels.push(mafia);
            } catch (err) {
                console.error(err);
            }
            break;
        case "/delete":
            Promise.all(
                gChannels.map(async (channel) => {
                    await channel.delete();
                })
            ).catch((err) => {
                console.error(err);
            });
            break;
        case "/createGuild":
			
        case "/guild":
            console.log(`The guild name is ${msg.guild.name}`);
        default:
    }
});
