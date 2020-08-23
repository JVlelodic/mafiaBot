const { Settings } = require("./Settings");
const config = require("./config.json");
const STATE = config.gameState;

class Game {
    /**
     *
     * @param {*} guild       Guild
     * @param {*} host        GuildMember
     * @param {*} talkChan    VoiceChanel
     * @param {*} msgChan     TextChannel
     * @param {*} roleId      Snowflake
     */

    constructor(guild, host, talkChan, msgChan, roleId) {
        this.guild = guild;
        this.host = host;
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
    test() {
        this.talkChan.members.each((user,key) => console.log(key));
    }
    
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
            await this.talkChan.delete();
            await this.msgChan.delete();

            const playerRole = await this.guild.roles.fetch(this.roleId);
            await playerRole.delete();
        } catch (err) {
            console.error(err);
        }
    };
    
    startGame = () => {
        this.settings = new Settings(this.talkChan);
        this.status = STATE.STARTED;
    }
    
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
    }
}

module.exports = {
    Game,
};
