import sbPlayer from './player.js';

export default class sbRoom {
    constructor(
        id = null,
        name = "Room 1",
        subtitle = "My Subtitle",
        gameId = null,
        playersData = [],
        activePlayerIds = [], // Array of { playerNumber: int, playerId: string }
        timerActive = true,
        roundTime = '2:45',
        roundTimeLeft = '0:03',
        roundTimerStartedAt = null,
        roundState = 0,
    ) {
        this.id = id;
        this.activePlayerIds = activePlayerIds;
        this.gameId = gameId;
        this.name = name;
        this.players = [];
        this.playerCount = 2;
        this.roundTime = roundTime;
        this.roundTimeLeft = roundTimeLeft;
        this.subtitle = subtitle;
        this.timerActive = timerActive;
        this.roundTimerStartedAt = roundTimerStartedAt;
        this.roundState = roundState;

        console.log('roundState: ', this.roundState);

        this.keyboardShortcuts = {
            'startPause': 'Spacebar',
            'points': {
                '1plus': '1',
                '1minus': '4',
                '2plus': '3',
                '2minus': '6'
            },
            'roundsWon': {
                '1plus': 'y',
                '1minus': 'a',
                '2plus': 'm',
                '2minus': 'k'
            },
            'resetRound': 'Delete',
            'endRound': 'Home',
            'newGame': 'N'
        };

        // Add players
        let playerAddCount = 0;

        for(let playerData of playersData) {
            playerAddCount++;
            let player = new sbPlayer(playerData.id, playerData.name, playerData.points, playerData.lifetimePoints, playerData.roundsWon, playerData.lifetimeRoundsWon);
            this.players.push(player);
        }

        // If there are not enough players for this game yet, add some additional players.
        while(playerAddCount < this.playerCount) {
            playerAddCount++;
            let player = new sbPlayer(null, 'Player ' + playerAddCount, 0, 0, 0, 0);
            this.players.push(player);
        }

        // When the active player count is invalid, we just set the first players in the player list for the next round.
        if(this.activePlayerIds.count < this.playerCount) {
            playerAddCount = 0;
            this.activePlayerIds = [];

            for(let player of this.players) {
                playerAddCount++;

                if(playerAddCount > this.playerCount) {
                    break;
                }

                this.setActivePlayer(playerAddCount, player.id);
            }
        }
    }

    // This is used from class internal and external calls. Do not remove it.
    setActivePlayer(playerNumber, playerId) {
        // Set an entry to null, if it has the same player id.
        for(let i = 0, j = this.activePlayerIds.length; i < j; i++) {
            if(this.activePlayerIds[i].playerId === playerId) {
                this.activePlayerIds[i].playerId = null;
                break;
            }
        }

        // Set the player with a specific number to the playerId, if one the number exists.
        for(let i = 0, j = this.activePlayerIds.length; i < j; i++) {
            if(this.activePlayerIds[i].playerNumber === playerNumber) {
                this.activePlayerIds[i].playerId = playerId;
                return;
            }
        }

        // If the playerNumber was not set yet, add a new one.
        this.activePlayerIds.push({
            playerNumber: playerNumber,
            playerId: playerId
        });
    }

    // Returns a player object or null, if the player with this number was not found.
    getActivePlayer(playerNumber) {
        let playerId = null;
        
        for(let i = 0, j = this.activePlayerIds.length; i < j; i++) {
            if(this.activePlayerIds[i].playerNumber === playerNumber) {
                playerId = this.activePlayerIds[i].playerId;
                break;
            }
        }

        if(playerId === null) {
            return null;
        }

        for(let player of this.players) {
            if(player.id === playerId) {
                return player;
            }
        }

        return null;
    }
}