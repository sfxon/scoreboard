import sbPlayer from './player.js';

export default class sbRoom {
    constructor(
        roomTitle = "Room 1", 
        gameTitle = "My Game",
        gameSubtitle = "My Subtitle",
        players = [],
        activePlayerIds = [] // Array of { playerNumber: int, playerId: string }
    ) {
        this.activePlayerIds = activePlayerIds;
        this.roomTitle = roomTitle;
        this.gameTitle = gameTitle;
        this.gameSubtitle = gameSubtitle;
        this.players = players;
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

        if(this.players.length === 0) {
            // Create player 1.
            let player = new sbPlayer(null, 'Home', 0, 0, 0);
            this.players.push(player);
            this.setPlayer(1, player.id);

            // Create player 2.
            player = new sbPlayer(null, 'Visitor', 0, 0, 0);
            this.players.push(player);
            this.setPlayer(2, player.id);
        }
    }

    setPlayer(playerNumber, playerId) {
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