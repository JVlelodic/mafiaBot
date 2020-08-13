const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const { default: axios } = require("axios");

const TOKEN = config.token;
const MAFIA_ROLE = "Mafia Players";

let addChannels = [];

client.login(TOKEN);

client.on("ready", () => {
    console.log("This bot is online");
});

client.on("message", async (msg) => {
    switch (msg.content) {
        case "!mafia":
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
                console.log(addChannels);

                const everyRole = msg.guild.roles.everyone;

                const playerRole = await msg.guild.roles.create({
                    data: {
                        name: MAFIA_ROLE,
                        color: "RED",
                    },
                });

                const perms = ["VIEW_CHANNEL", "SPEAK", "CONNECT"];

                //Change the permissions
                townhall.overwritePermissions([
                    { id: everyRole, deny: perms },
                    { id: playerRole, allow: perms },
                ]);

                mafia.overwritePermissions([
                    { id: everyRole, deny: perms },
                    { id: playerRole, allow: perms },
                ]);

                const currPlayer = msg.member;

                //If in voice channel in this guild, move him into mafia server
                await moveChannel(
                    currPlayer,
                    townhall,
                    msg.channel,
                    playerRole
                );
            } catch (err) {
                console.error(err);
            }
            break;
        case "!join":
            break;
        case "!delete":
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

//Moves player to Mafia channel and adds mafia role to player
const moveChannel = async (member, channel, broadcast, role) => {
    try {
        if (member.voice.channel) {
            await member.roles.add(role);

            await member.edit({
                channel: channel,
            });
        } else {
            await broadcast.send(
                `${member.toString()} Please enter a voice channel and msg !join to participate in the Mafia Game`
            );
        }
    } catch (err) {
        console.error(err);
    }
};
