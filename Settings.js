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

        //Collection<Snowflake, Snowflake>
        this.mafias = mafias;
        
        //Guildmember
        this.docotor = doctor;
        this.officer = officer;

        //Set<Snowflake>
        this.dead = new Set();
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
        let remain = Math.floor(players.length / MAFIADIV);
        let copy = Array.from(players);

        let mafias = new Map();

        while (remain != 0) {
            let rand = this._randomIndex(copy.length);
            let selected = copy.splice(rand, 1)[0];
            mafias.set(selected.user.id, "");
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
     *
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

    confirmVote = () => {
        let votes = new Map();
        this.userToVote.forEach((snowflake, voter) => {
            const numVotes = votes.get(snowflake);
            if (!numVotes) {
                numVotes = 1;
            } else {
                numVotes += 1;
            }
            votes.set(snowflake, numVotes);
            //Reset vote to no one
            this.userToVote.set(voter, "");
        });

        let max = 0;
        let currDead = null;
        let dup = false;
        votes.forEach((numVotes, user) => {
            if (numVotes === max) {
                dup = true;
            } else if (numVotes > max) {
                dup = false;
                currDead = user;
            }
        });

        //Check if multiple people have equal votes then noone is killed
        //If nobody was voted, don't add it to killed
        if (!dup && currDead !== "") {
            this.dead.add(currDead);
        }
    };

    /**
     * Record user that a mafia wants to kill
     *
     * @param {*} player      Snowflake 
     * @param {*} kill        String
     */
    recordKill = (player, kill) => {
        const snowflake = this.userToSnow.get(kill);

        if (
            snowflake &&
            !this.dead.has(snowflake) &&
            !this.mafias.has(snowflake)
        ) {
            this.mafias.set(player, killed);
            return true;
        }
        return false;
    };

    confirmKill = () => {
        const vals = this.mafias.entries();
        let prevKilled = null;
        this.mafias.forEach((toKill, mafia) => {
            if(!prevKilled){
                prevKilled = toKill;
            }else{
                if(prevKilled !== toKill){
                    return false;
                }
            }
        });
        this.dead.add(prevKilled);
        return true;
    };

    /**
     * 
     * @param {*} player Snowflake
     * @param {*} heal   String (username)
     */
    recordHeal = (player, heal) => {
        
    }
}

module.exports = {
    Settings,
};
