const { Settings } = require("./Settings");
const config = require("./config.json");
const STATE = config.gameState;

class Game {
    /**
     *
     * @param {*} guild       Guild
     * @param {*} host        GuildMember
     * @param {*} category    CategoryChannel
     * @param {*} talkChan    VoiceChanel
     * @param {*} msgChan     TextChannel
     * @param {*} roleId      Snowflake
     */

    constructor(guild, host, category, talkChan, msgChan, roleId) {
        this.guild = guild;
        this.host = host;
        this.category = category;
        this.talkChan = talkChan;
        this.msgChan = msgChan;
        this.roleId = roleId;
        this.settings = null;
        this.status = STATE.WAITING;
    }

    /**
     * Moves player to Mafia channel and adds mafia role to player
     * @param {*} member GuildMember
     */

    moveChannel = async (member) => {
        try {
            let ret = {
                moved: true,
                reason: "",
            };

            //Make sure that the player is in a voice channel
            if (member.voice.channel) {
                await member.roles.add(this.roleId);

                await member.edit({
                    channel: this.talkChan,
                });
            } else {
                ret.moved = false;
                ret.reason = `${member.toString()} Enter a voice channel and msg **!join** to play Mafia Game`;
            }

            return Promise.resolve(ret);
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Remove channels and roles so game instance can be deleted
     */
    endGame = async () => {
        try {
            this.category.children.each(async (channel) => {
                await channel.delete();
            });

            await this.category.delete();

            const playerRole = await this.guild.roles.fetch(this.roleId);
            await playerRole.delete();
        } catch (err) {
            console.error(err);
        }
    };

    startGame = () => {
        this.settings = new Settings(this.talkChan.members);
        this.status = STATE.STARTED;
    };

    /**
     *
     * @param {*} player    GuildMember
     * @param {*} snowflake String (username)
     */
    checkVote = (player, voteoff) => {
        const res = this.settings.recordVote(player.id, voteoff);
        if (res) {
            return `${player.toString()} wants to prosecute ${voteoff}`;
        } else {
            return `${voteoff} is already dead and cannot be voted off`;
        }
    };

    //GETTERS

    /**
     * Return the member that started the game
     */
    getHost = () => {
        return this.host;
    };

    getAllPlayers = () => {
        return this.talkChan.members;
    };

    getStatus = () => {
        return this.status;
    };
}

module.exports = {
    Game,
};
