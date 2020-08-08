const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const { default: axios } = require("axios");

const TOKEN = config.token;
const URL = config.url;
const MAFIA_ROLE = "Mafia Players";

let addChannels = [];

client.login(TOKEN);

client.on("ready", () => {
    console.log("This bot is online");
});

client.on("message", async (msg) => {
    switch (msg.content) {
        case "MAFIA":
            try {
                const server = msg.guild.channels;
                //Create the channels
                const townhall = await server.create("Townhall", {
                    type: "voice",
                });

                const mafia = await server.create("Mafia", {
                    type: "text",
                });

                addChannels.push(townhall);
                addChannels.push(mafia);

                const everyRole = msg.guild.roles.everyone;

                const playerRole = await msg.guild.roles.create({
                    data: {
                        name: MAFIA_ROLE,
                        color: "RED",
                    },
                });

                townhall.overwritePermissions([
                    {
                        id: everyRole,
                        deny: ["VIEW_CHANNEL", "SPEAK", "CONNECT"],
                    },
                    {
                        id: playerRole,
                        allow: ["VIEW_CHANNEL", "SPEAK", "CONNECT"],
                    },
                ]);

                const currPlayer = msg.member;
                await currPlayer.roles.add(playerRole);

                //If in voice channel in this guild, move him into mafia server
                if (currPlayer.voice.channel) {
                    await currPlayer.edit({
                        channel: townhall,
                    });
                } else {
                    await msg.channel.send(
                        `${msg.author.toString()} Please enter a voice channel and msg /join to participate in the Mafia Game`
                    );
                }
            } catch (err) {
                console.error(err);
            }
            break;
        case "/delete":
            try {
                Promise.all(
                    addChannels.map(async (channel) => {
                        await channel.delete();
                    })
                );

                const allRoles = msg.guild.roles.cache;
                allRoles.each(async (role) => {
                    if (role.name === MAFIA_ROLE) {
                        await role.delete();
                    }
                });
            } catch (err) {
                console.error(err);
            }
            break;

        default:
    }
});
