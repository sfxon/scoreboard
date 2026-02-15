import sbApiLoader from './scoreboard-api-loader.js';
import sbIncrementAnimator from './scoreboardIncrementAnimator.js';
import sbPlayer from './player.js';
import sbRoom from './room.js';
import sbTimer from './timer.js';

/**
 * This class represents the scoreboard display and handles it's functionality.
 */
export default class sbScoreboard {
    constructor(
    ) {
        this.api = null;
        this.myRoom = null;
        this.roomNameEl = null;
        this.roomNameId = 'sb-room-name';
        this.roomSubtitleEl = null;
        this.roomSubtitleId = 'sb-subtitle';
        this.keyboardShortcutsActivated = true;
        this.myIncrementAnimator = new sbIncrementAnimator();
        this.roomId = null;
        this.timer = new sbTimer();
    }

    activatePlayer(playerNumber, playerId) {
        this.myRoom.setActivePlayer(playerNumber, playerId);
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
        this.myIncrementAnimator.prepareAnimation('points' + playerNumber, player.name, 1);
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
        this.roomNameEl = document.getElementById(this.roomNameId);
        this.roomSubtitleEl = document.getElementById(this.roomSubtitleId);
        this.updateView();
        this.initKeyboardShortcuts();
    }

    async initApi() {
        let apiLoader = new sbApiLoader('sbLocalApiEndpoint');
        await apiLoader.loadImplementation();
        this.api = apiLoader.getApi();
    }

    initKeyboardShortcuts() {
        document.addEventListener('keyup', (event) => {
            if(!this.keyboardShortcutsActivated) {
                return;
            }

            // Start / Pause the game.
            if(event.key === this.myRoom.keyboardShortcuts['startPause']) {
                console.log('@TODO: Implement start/stop timer.');
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

    async load() {
        // Get the room id from the url.
        await this.initApi();
        const params = new URLSearchParams(window.location.search);
        this.roomId = params.get("id");
        this.room = await this.loadRoom(this.roomId);

        // Load game
        let game = await this.loadGameById(this.room.gameId);
        
        // Load players
        let players = await this.loadPlayersByRoomId(this.room.id);

        this.myRoom = new sbRoom(
            this.roomId,
            this.room.name,
            this.room.subtitle,
            game.id,
            players,
            this.room.activePlayerIds,
            this.room.timerActive,
            this.room.roundTime,
            this.room.roundTimeLeft,
            this.room.roundTimerStartedAt,
            this.room.roundSate
        );

        this.init();
    }

    async loadGameById(gameId) {
        let gameData = await this.api.post('game/load', { id: gameId });
        return gameData;
    }

    
    async loadPlayersByRoomId(roomId) {
        let players = await this.api.post('players/loadByRoomId', { roomId: roomId });

        if(!Array.isArray(players)) {
            players = [];
        }

        return players;
    }

    async loadRoom(roomId) {
        let roomData = await this.api.post('room/load', { id: roomId });
        return roomData;
    }

    updatePlayerValue(playerId, methodName, value) {
        let player = this.getPlayerById(playerId);
        player[methodName](value);
    }

    updatePlayerViews() {
        for(let i = 0, j = (this.myRoom.activePlayerIds.length); i < j; i++) {
            let activePlayerEntry = this.myRoom.activePlayerIds[i];

            let playerNumber = activePlayerEntry['playerNumber'];
            let playerId = activePlayerEntry['playerId'];
            let player = null;

            if(playerId !== null) {
                player = this.getPlayerById(playerId);
            }

            // Thats designed as this on purpose, since an active player could be set, but the player not be loaded yet.
            if(player === null) {
                player = new sbPlayer(null, '---', 0, 0, 0, 0);
            }

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
        this.roomNameEl.innerHTML = this.myRoom.name;
        this.roomSubtitleEl.innerHTML = this.myRoom.subtitle;
    }

    saveActivePlayers() {
        let data = {};
        data['id'] = this.myRoom.id;
        data['activePlayerIds'] = this.myRoom.activePlayerIds;
        this.api.post('room/update', data);
    }
}