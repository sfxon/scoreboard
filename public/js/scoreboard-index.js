import sbApiLoader from './scoreboard-api-loader.js';

/**
 * This class represents the scoreboard display and handles it's functionality.
 */
export default class sbScoreboardIndex {
    constructor(
    ) {
        this.api = null;
        this.createRoomBtnEl = null;
        this.createRoomBtnId = 'sb-index-create-room-btn';
        this.createRoomModal = null;
        this.createRoomModalEl = null;
        this.createRoomModalId = 'sb-index-create-room-modal';
        this.gameIdSelectEl = null;
        this.gameIdSelectId = 'sb-index-create-room-game-id';
        this.openModalBtnEl = null;
        this.openModalBtnId = 'sb-index-open-modal-btn';
        this.roomNameInputEl = null;
        this.roomNameInputId = 'sb-index-create-room-name';
        this.roomTemplateId = 'sb-index-room-template';
        this.scoreboardListId = 'sb-index-scoreboard-list';

        document.addEventListener('DOMContentLoaded', async() => {
            await this.initApi();
            this.loadRooms();
            this.initModal();
            this.initOpenModalBtn();
            this.initCreateRoomBtn();
        });
    }

    async initApi() {
        let apiLoader = new sbApiLoader('sbLocalApiEndpoint');
        await apiLoader.loadImplementation();
        this.api = apiLoader.getApi();
    }

    initCreateRoomBtn() {
        this.openModalBtnEl = document.getElementById(this.createRoomBtnId);
        this.openModalBtnEl.addEventListener('click', async (event) => {
            // GetName of the room.
            this.roomNameInputEl = document.getElementById(this.roomNameInputId);
            this.gameIdSelectEl = document.getElementById(this.gameIdSelectId);

            await this.api.post('room/create', {'name': this.roomNameInputEl.value, 'gameId': this.gameIdSelectEl.value });
            this.loadRooms();
            this.createRoomModal.hide();
        });
    }

    initOpenModalBtn() {
        this.createRoomBtnEl = document.getElementById(this.openModalBtnId);
        this.createRoomBtnEl.addEventListener('click', (event) => {
            this.createRoomModal.show();
        });
    }

    initModal() {
        this.createRoomModalEl = document.getElementById(this.createRoomModalId);
        this.createRoomModal = new bootstrap.Modal(
            this.createRoomModalEl, 
            {
                keyboard: false
            }
        );
    }

    async loadRooms() {
        let templateObj = document.createElement('template');
        let roomTemplateEl = document.getElementById(this.roomTemplateId);
        templateObj.innerHTML = roomTemplateEl.innerHTML;

        let scoreboardListEl = document.getElementById(this.scoreboardListId);
        scoreboardListEl.innerHTML = '';

        let games = await this.api.post('game/load', []);
        let rooms = await this.api.post('room/load', []);

        if(Array.isArray(rooms)) {
            for(let room of rooms) {
                let newRoomContainer = templateObj.content.firstElementChild.cloneNode(true);

                // Set room name.
                let roomNameEl = newRoomContainer.querySelector('.sb-index-room-title');
                roomNameEl.textContent = room.name;

                // TODO: Set game name.
                let gameNameEl = newRoomContainer.querySelector('.sb-index-room-game');
                gameNameEl.textContent = this.getGameNameFromGames(games, room.gameId);

                // Set link url
                let url = 'room.html?id=' + room.id;
                let roomButtonLinkEl = newRoomContainer.querySelector('.sb-index-room-button-link');
                roomButtonLinkEl.href = url;

                scoreboardListEl.appendChild(newRoomContainer);
            }
        }
    }

    getGameNameFromGames(games, gameId) {
        for(let game of games) {
            if(game.id === gameId) {
                return game.name;
            }
        }

        return null;
    }
}