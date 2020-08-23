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
        this.userToSnow = this._mapUsernames(allPlayers);

        //Collection<String, Int>
        this.userToVotes = this._mapUserVotes(allPlayers);

        let { mafias, doctor, officer } = this._setRoles(allPlayers);

        this.mafias = mafias;
        this.docotor = doctor;
        this.officer = officer;
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
            officer
        };
    };

    _randomIndex = (length) => {
        return Math.floor(Math.random().length);
    };
}

module.exports = {
    Settings,
};
