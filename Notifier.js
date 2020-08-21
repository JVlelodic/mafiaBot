class Notifier {

    /**
     * 
     * @param {*} mainChan TextChannel
     */
    constructor(mainChan) {
        this.mainChan = mainChan;
    }

    /** 
     * Broadcasts message to main text channel in guild
     * @param {*} msg String
     */

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
}

module.exports = {
    Notifier,
};
