const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const { default: axios } = require("axios");
const { Game } = require("./Game.js");

const TOKEN = config.token;
const MAFIA_ROLE = "Mafia Players";

//Globals

let gameInst = null;

client.login(TOKEN);

client.on("ready", () => {
    console.log("This bot is online");
});

client.on("message", async (msg) => {
    try {
        switch (msg.content) {
            case "!mafia":
                const server = msg.guild.channels;

                //Check if a game already exists
                if (!gameInst) {
                    const talkChan = await server.create("Townhall", {
                        type: "voice",
                    });

                    const msgChan = await server.create("Mafia", {
                        type: "text",
                    });

                    const playerRole = await msg.guild.roles.create({
                        data: {
                            name: MAFIA_ROLE,
                            color: "RED",
                        },
                    });

                    gameInst = new Game(
                        msg.guild,
                        msg.guild.systemChannel,
                        talkChan,
                        msgChan,
                        playerRole.id
                    );

                    const everyRole = msg.guild.roles.everyone;

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

                    await gameInst.moveChannel(msg.member);
                } else {
                    msg.guild.systemChannel.send(
                        "Mafia game has already been created"
                    );
                }
                break;
            case "!join":
                if (gameInst) {
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
                if (gameInst) {
                    await gameInst.endGame();
                    gameInst = null;
                } else {
                    msg.guild.systemChannel.send(
                        "There is no Mafia Game to delete"
                    );
                }
                break;
            default:
                break;
        }
    } catch (err) {
        console.error(err);
    }
});
