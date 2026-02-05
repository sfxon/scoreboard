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
        this.openModalBtnEl = null;
        this.openModalBtnId = 'sb-index-open-modal-btn';

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
            await this.api.post('room/create', []);
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
        let result = await this.api.post('room/load', []);

        console.log(result);
    }
}