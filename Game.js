class Game {
    /**
     *
     * @param {*} guild       Guild
     * @param {*} talkChan    VoiceChanel
     * @param {*} msgChan     TextChannel
     * @param {*} roleId      Snowflake
     */

    constructor(guild, talkChan, msgChan, roleId) {
        this.guild = guild;
        this.talkChan = talkChan;
        this.msgChan = msgChan;
        this.roleId = roleId;
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
                // await this.sendMsg(
                //     `${member.toString()} Enter a voice channel and msg **!join** to play Mafia Game`
                // );
                ret.moved = false;
                ret.reason = `${member.toString()} Enter a voice channel and msg **!join** to play Mafia Game`
            }

            return Promise.resolve(ret);
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
}

module.exports = {
    Game,
};
