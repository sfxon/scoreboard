import sbRoom from './room.js';
import sbTimer from './timer.js';

/**
 * This class represents the scoreboard display and handles it's functionality.
 */
export default class sbScoreboard {
    constructor(
    ) {
        this.gameTitleEl = null;
        this.gameTitleId = 'sb-title';
        this.gameSubtitleEl = null;
        this.gameSubtitleId = 'sb-subtitle';
        this.keyboardShortcutsActivated = true;
        this.myRoom = new sbRoom();
        this.timer = new sbTimer();
        this.init();
    }

    activatePlayer(playerNumber, playerId) {
        this.myRoom.setPlayer(playerNumber, playerId);
        this.updatePlayerViews();
    }

    addPlayer(player) {
        this.myRoom.players.push(player);
    }

    decrementPlayerPoints(playerNumber) {
        let playerId = this.getPlayerIdByNumber(playerNumber);
        let player = this.getPlayerById(playerId);
        player.reducePoints(1);
        this.updatePlayerViews();
    }

    decrementPlayerRounds(playerNumber) {
        let playerId = this.getPlayerIdByNumber(playerNumber);
        let player = this.getPlayerById(playerId);
        player.reduceRoundsWon();
        this.updatePlayerViews();
    }

    getPlayerByNumber(playerNumber) {
        let playerId = this.getPlayerIdByNumber(playerNumber);
        let player = this.getPlayerById(playerId);
        return player;
    }

    getPlayerIdByNumber(playerNumber) {
        for(let i = 0, j = this.myRoom.activePlayerIds.length; i < j; i++) {
            if(this.myRoom.activePlayerIds[i].playerNumber === playerNumber) {
                return this.myRoom.activePlayerIds[i].playerId;
            }
        }

        return null;
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

    endRound() {
        for(let playerIdsEntry of this.myRoom.activePlayerIds) {
            let player = this.getPlayerById(playerIdsEntry['playerId']);
            player.addLifetimePoints(player.points);
            player.points = 0;
        }

        this.updatePlayerViews();
    }

    resetRound() {
        for(let playerIdsEntry of this.myRoom.activePlayerIds) {
            let player = this.getPlayerById(playerIdsEntry['playerId']);
            player.points = 0;
        }

        this.updatePlayerViews();
    }

    newGame() {
        for(let playerIdsEntry of this.myRoom.activePlayerIds) {
            let player = this.getPlayerById(playerIdsEntry['playerId']);
            player.points = 0;
            player.roundsWon = 0;
        }

        this.updatePlayerViews();
    }

    incrementPlayerPoints(playerNumber) {
        let player = this.getPlayerByNumber(playerNumber);
        player.addPoints(1);
        this.updatePlayerViews();
    }

    incrementPlayerRounds(playerNumber) {
        let player = this.getPlayerByNumber(playerNumber);
        player.addRoundsWon();
        this.updatePlayerViews();
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

        this.initKeyboardShortcuts();
    }

    initKeyboardShortcuts() {
        document.addEventListener('keyup', (event) => {
            if(!this.keyboardShortcutsActivated) {
                return;
            }

            // Start / Pause the game.
            if(event.key === this.myRoom.keyboardShortcuts['startPause']) {
                console.log('TODO: Implement start/stop timer.');
            }

            // Points added or removed per player.
            if(event.key === this.myRoom.keyboardShortcuts.points['1plus']) {
                this.incrementPlayerPoints(1);
            }

            if(event.key === this.myRoom.keyboardShortcuts.points['1minus']) {
                this.decrementPlayerPoints(1);
            }

            if(event.key === this.myRoom.keyboardShortcuts.points['2plus']) {
                this.incrementPlayerPoints(2);
            }

            if(event.key === this.myRoom.keyboardShortcuts.points['2minus']) {
                this.decrementPlayerPoints(2);
            }

            // Rounds added or removed per player.
            if(event.key === this.myRoom.keyboardShortcuts.roundsWon['1plus']) {
                this.incrementPlayerRounds(1);
            }

            if(event.key === this.myRoom.keyboardShortcuts.roundsWon['1minus']) {
                this.decrementPlayerRounds(1);
            }

            if(event.key === this.myRoom.keyboardShortcuts.roundsWon['2plus']) {
                this.incrementPlayerRounds(2);
            }

            if(event.key === this.myRoom.keyboardShortcuts.roundsWon['2minus']) {
                this.decrementPlayerRounds(2);
            }

            // End round
            if(event.key === this.myRoom.keyboardShortcuts['endRound']) {
                this.endRound();
            }

            // Reset
            if(event.key === this.myRoom.keyboardShortcuts['resetRound']) {
                this.resetRound();
            }

            // NewGame
            if(event.key === this.myRoom.keyboardShortcuts['newGame']) {
                this.newGame();
            }
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