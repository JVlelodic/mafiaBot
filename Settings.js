const config = require("./config.json");
const MAFIADIV = config.mafiaDiv;

class Settings {
    /**
     *
     * @param {*} allPlayers Collection<Snowflake, GuildMember>
     */

    constructor(allPlayers) {
        //Collection<Snowflake, GuildMember>
        this.allPlayers = allPlayers;

        //Collection<String, Snowflake>
        this.userToSnow = this._mapUserSnow(allPlayers);

        //Collection<Snowflake, Snowflake>
        this.userToVote = this._mapUserVote(allPlayers);

        let { mafias, doctor, officer } = this._setRoles(allPlayers);

        this.mafias = mafias;
        this.docotor = doctor;
        this.officer = officer;
        this.dead = new Map();
    }

    _mapUserSnow = (players) => {
        let userDict = new Map();
        players.each((member, snowflake) => {
            const username = member.user.username.trim().toLowerCase();
            userDict.set(username, snowflake);
        });

        return userDict;
    };

    _mapUserVote = (players) => {
        let voteDict = new Map();
        players.each((member, snowflake) => {
            // const username = member.user.username.toLowerCase();
            voteDict.set(snowflake, "");
        });

        return voteDict;
    };

    _setRoles = (playerMap) => {
        let players = playerMap.array();
        let mafias = [];
        let remain = Math.floor(players.length / MAFIADIV);
        let copy = Array.from(players);

        while (remain != 0) {
            let rand = this.randomIndex(copy.length);
            let selected = copy.splice(rand, 1)[0];
            mafias.push(selected);
            remain -= 1;
        }

        let doctor = copy.splice(this._randomIndex(copy.length), 1)[0];
        let officer = copy.splice(this._randomIndex(copy.length), 1)[0];

        return {
            mafias,
            doctor,
            officer,
        };
    };

    _randomIndex = (length) => {
        return Math.floor(Math.random().length);
    };

    /**
     * Record a vote
     * @param {*} player      Snowflake
     * @param {*} vote        String
     */

    recordVote = (player, vote) => {
        const snowflake = this.userToSnow.get(vote);

        if (snowflake && !this.dead.has(snowflake)) {
            this.userToVote.set(player, snowflake);
            return true;
        }
        return false;
    };
}

module.exports = {
    Settings,
};
