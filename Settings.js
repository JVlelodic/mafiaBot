class Settings {
    /**
     *
     * @param {*} allPlayers Collection<Snowflake, GuildMember>
     */

    constructor(allPlayers) {
        //Collection<Snowflake, GuildMember>
        this.allPlayers = allPlayers;

        //Collection<String, Snowflake>
        this.userToSnow = this._mapUsernames(allPlayers);

        //Collection<String, Int>
        this.userToVotes = this._mapUserVotes(allPlayers);

        this.mafias = this._setMafia(allPlayers);
    }

    _mapUsernames = (players) => {
        let userDict = new Map();
        players.each((member, snowflake) => {
            const username = member.user.username.toLowerCase();
            userDict[username] = snowflake;
        });

        return userDict;
    };

    _mapUserVotes = (players) => {
        let voteDict = new Map();
        players.each((member) => {
            const username = member.user.username.toLowerCase();
            voteDict[username] = 0;
        });

        return voteDict;
    };

    _setMafia = (playerMap) => {
        let players = playerMap.array();
        let mafias = [];
        let remain = Math.floor(players.length / 3);
        let copy = Array.from(players);

        while (remain != 0) {
            let rand = Math.floor(Math.random() * copy.length);
            let selected = copy.splice(rand, rand);
            mafias.push(selected);
            remain -= 1;
        }

        return mafias;
    };
}

module.exports = {
    Settings,
};
