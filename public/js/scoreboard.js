import sbRoom from './room.js';

/**
 * This class represents the scoreboard display and handles it's functionality.
 */
export default class sbScoreboard {
    constructor(
    ) {
        this.myRoom = new sbRoom();
        this.gameTitleEl = null;
        this.gameTitleId = 'sb-title';
        this.gameSubtitleEl = null;
        this.gameSubtitleId = 'sb-subtitle';
        this.init();
    }

    activatePlayer(playerNumber, playerId) {
        this.myRoom.setPlayer(playerNumber, playerId);
        this.updatePlayerViews();
    }

    addPlayer(player) {
        this.myRoom.players.push(player);
    }

    getPlayerById(playerId) {
        for(let i = 0, j = this.myRoom.players.length; i < j; i++) {
            if(this.myRoom.players[i].id === playerId) {
                return this.myRoom.players[i];
            }
        }

        return null;
    }

    /**
     * Get's the sbRoom instance.
     * @returns sbRoom
     */
    getRoom() {
        return this.myRoom;
    }

    /**
     * Initialise html elements.
     */
    init() {
        this.gameTitleEl = document.getElementById(this.gameTitleId);
        this.gameSubtitleEl = document.getElementById(this.gameSubtitleId);

        document.addEventListener('DOMContentLoaded', () => {
            this.updateView();
        });
    }

    updatePlayerValue(playerId, fieldName, value) {
        let player = this.getPlayerById(playerId);
        player[fieldName] = value;
    }

    updatePlayerViews() {
        for(let i = 1, j = (this.myRoom.activePlayerIds.length); i < j; i++) {
            let activePlayerEntry = this.myRoom.activePlayerIds[i];
            let playerNumber = activePlayerEntry['playerNumber'];
            let playerId = activePlayerEntry['playerId'];
            let player = this.getPlayerById(playerId);

            // Set name.
            let domEl = document.querySelector('#sb-player-' + playerNumber + ' .name');
            domEl.innerHTML = player.name;

            // Set points.
            domEl = document.querySelector('#sb-player-' + playerNumber + ' .points');
            domEl.innerHTML = player.points;

            // Set roundsWon.
            domEl = document.querySelector('#sb-player-' + playerNumber + ' .rounds-won');
            domEl.innerHTML = player.roundsWon;

            // Set total points.
            domEl = document.querySelector('#sb-player-' + playerNumber + ' .lifetime-points');
            domEl.innerHTML = player.lifetimePoints;
        }
    }

    /**
     * Updates the display.
     */
    updateView() {
        this.gameTitleEl.innerHTML = this.myRoom.gameTitle;
        this.gameSubtitleEl.innerHTML = this.myRoom.gameSubtitle;
    }
}