class Game {
    /**
     *
     * @param {*} guild       Guild
     * @param {*} mainChan    TextChannel
     * @param {*} talkChan    VoiceChanel
     * @param {*} roleId      Snowflake
     */
    constructor(guild, mainChan, talkChan, msgChan, roleId) {
        this.guild = guild;
        this.mainChan = mainChan;
        this.talkChan = talkChan;
        this.msgChan = msgChan;
        this.roleId = roleId;

        // this.moveChannel = this.moveChannel.bind(this);
    }

    /**
     * Moves player to Mafia channel and adds mafia role to player
     * @param {*} member GuildMember
     */

    moveChannel = async (member) => {
        try {
            //Make sure that the player is in a voice channel
            if (member.voice.channel) {
                await member.roles.add(this.roleId);

                await member.edit({
                    channel: this.talkChan,
                });
            } else {
                await this.sendMsg(
                    `${member.toString()} Enter a voice channel and msg **!join** to play Mafia Game`
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

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

    sendMsg = async (msg) => {
        try {
            const embed = {
                color: 1752220,
                description: msg,
            };

            await this.mainChan.send({ embed });
        } catch (err) {
            console.error(err);
        }
    };
    
    isCreated = () => {
        return this.talkChan && this.msgChan && this.roleId;
    }

    
}

module.exports = {
    Game,
};
