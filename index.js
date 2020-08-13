const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const { default: axios } = require("axios");

const TOKEN = config.token;
const MAFIA_ROLE = "Mafia Players";

//Globals
let talkChan = null;
let msgChan = null;
let roleId = null;

client.login(TOKEN);

client.on("ready", () => {
    console.log("This bot is online");
});

client.on("message", async (msg) => {
    try {
        switch (msg.content) {
            case "!mafia":
                const server = msg.guild.channels;

                //Create the channels
                if (!talkChan) {
                    const townhall = await server.create("Townhall", {
                        type: "voice",
                    });

                    talkChan = townhall;
                }

                if (!msgChan) {
                    const mafia = await server.create("Mafia", {
                        type: "text",
                    });

                    msgChan = mafia;
                }

                console.log("Voice channel is " + talkChan);
                console.log("Text channel is " + msgChan);

                const everyRole = msg.guild.roles.everyone;

                const playerRole = await msg.guild.roles.create({
                    data: {
                        name: MAFIA_ROLE,
                        color: "RED",
                    },
                });

                roleId = playerRole.id;

                const perms = ["VIEW_CHANNEL", "SPEAK", "CONNECT"];

                //Change the permissions
                talkChan.overwritePermissions([
                    { id: everyRole, deny: perms },
                    { id: playerRole, allow: perms },
                ]);

                msgChan.overwritePermissions([
                    { id: everyRole, deny: perms },
                    { id: playerRole, allow: perms },
                ]);

                //If in voice channel in this guild, move him into mafia server
                await moveChannel(msg.member, msg.channel, playerRole);
                break;
            case "!join":
                if (roleId) {
                    const playerRole = await msg.guild.roles.fetch(roleId);
                    await moveChannel(msg.member, msg.channel, playerRole);
                } else {
                    await msg.channel.send(
                        "Please start mafia game first by msging !mafia in a text channel"
                    );
                }
                break;
            case "!start":
                break;
            case "!delete":
                if (talkChan) {
                    await talkChan.delete();
                    talkChan = null;
                }

                if (msgChan) {
                    await msgChan.delete();
                    msgChan = null;
                }

                const allRoles = msg.guild.roles.cache;
                allRoles.each(async (role) => {
                    if (role.name === MAFIA_ROLE) {
                        await role.delete();
                    }
                });
                break;
            default:
                break;
        }
    } catch (err) {
        console.error(err);
    }
});

//Moves player to Mafia channel and adds mafia role to player
const moveChannel = async (member, broadcast, role) => {
    try {
        //Check if a mafia game has been started
        if (!talkChan) {
            await broadcast.send(
                "Please start mafia game first by msging !mafia in a text channel"
            );
            //Make sure that the player is in a voice channel
        } else if (member.voice.channel) {
            await member.roles.add(role);

            await member.edit({
                channel: talkChan,
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
