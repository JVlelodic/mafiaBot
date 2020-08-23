const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const { Game } = require("./Game.js");
const { Notifier } = require("./Notifier.js");

const TOKEN = config.token;
const STATE = config.gameState;

//Globals
let notifier = null;
let gameInst = null;

client.login(TOKEN);

client.on("ready", () => {
    console.log("This bot is online");
});

client.on("message", async (msg) => {
    try {
        if (!notifier) {
            notifier = new Notifier(msg.guild.systemChannel);
        }

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
                            name: "Mafia Players",
                            color: "RED",
                        },
                    });

                    gameInst = new Game(
                        msg.guild,
                        msg.member,
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

                    notifier.sendMsg("Mafia game created!");

                    const res = await gameInst.moveChannel(msg.member);
                    if (!res.moved) {
                        await notifier.sendMsg(res.reason);
                    }
                } else {
                    notifier.sendMsg("Mafia Game has already been created");
                }
                break;
            case "!join":
                if (!gameInst) {
                    await notifier.sendMsg(
                        "Start Mafia Game first by msging **!mafia**"
                    );
                } else if (gameInst.getStatus() === STATE.STARTED) {
                    await notifier.sendMsg(
                        "Mafia Game has already been started, join again once game has finished"
                    );
                } else {
                    const res = await gameInst.moveChannel(msg.member);
                    if (!res.moved) {
                        await notifier.sendMsg(res.reason);
                    } else {
                        await notifier.sendMsg(
                            `${msg.member.toString()} is now playing Mafia`
                        );
                    }
                }
                break;
            case "!start":
                if (!gameInst) {
                    notifier.sendMsg("No Mafia Game exists");
                } else if (gameInst.getStatus() === STATE.STARTED) {
                    notifier.sendMsg("Mafia Game has already been started");
                } else if (gameInst.getHost().id === msg.member.id) {
                    notifier.sendMsg("Game has been started");
                    gameInst.test();
                } else {
                    notifier.sendMsg(
                        `Only ${gameInst.getHost().toString()} can start the game`
                    );
                }
                break;
            case "!delete":
                if (gameInst) {
                    await gameInst.endGame();
                    gameInst = null;
                } else {
                    notifier.sendMsg("No Mafia Game exists");
                }
                break;
            default:
                break;
        }
    } catch (err) {
        console.error(err);
    }
});
