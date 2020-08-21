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
        this.embed = {
            
        }
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
                await this.mainChan.send(
                    `${member.toString()} Please enter a voice channel and msg !join to participate in the Mafia Game`
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
            
        } catch (err) {
        }
    };
}

module.exports = {
    Game,
};
