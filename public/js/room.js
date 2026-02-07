import sbPlayer from './player.js';

export default class sbRoom {
    constructor(
        roomTitle = "Room 1", // @TODO: Refactor: rename this to name.
        gameSubtitle = "My Subtitle", // @TODO: Refactor: rename this to subtitle.
        gameTitle = "My Game", // @TODO: Refactor: rename this to gameName.
        playersData = [],
        activePlayerIds = [] // Array of { playerNumber: int, playerId: string }
    ) {
        this.activePlayerIds = activePlayerIds;
        this.roomTitle = roomTitle;
        this.gameTitle = gameTitle;
        this.gameSubtitle = gameSubtitle;
        this.players = [];
        this.playerCount = 2;

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
        for(let i = 0, j = this.activePlayerIds.length; i < j; i++) {
            if(this.activePlayerIds.playerNumber === playerNumber) {
                this.activePlayerIds.playerId = playerId;
                return;
            }
        }

        // If it could not be set, the playerNumber was not set yet. Set it manually.
        this.activePlayerIds.push({
            playerNumber: playerNumber,
            playerId: playerId
        });
    }
}