import sbAdminGeneral from './admin-general.js';
import sbAdminPlayers from './admin-players.js';

export default class sbAdmin {
    /**
     * @param {*} scoreboard 
     */
    constructor(scoreboard) {
        this.sbModal = null;
        this.sbModalEl = null;
        this.sbModalId = 'admin-modal';
        this.scoreboard = scoreboard;
        this.sbAdminGeneral = null;
        this.init();
    }

    /**
     * Initialise functionality.
     * Has to be called, so that the admin functionality is working.
     */
    init() {
        // Hook everything togehter, when the DOM loading is finished.
        document.addEventListener('DOMContentLoaded', () => {
            // Init room values in editor and website.
            this.initModal();
            this.sbModal.show();
            this.sbAdminGeneral = new sbAdminGeneral(this.sbModal, this.scoreboard);
            this.sbAdminPlayers = new sbAdminPlayers(this.sbModal, this.scoreboard);
        });
    }

    /**
     * Initialise the bootstrap 5 modal element.
     */
    initModal() {
        this.sbModalEl = document.getElementById(this.sbModalId);
        this.sbModal = new bootstrap.Modal(
            this.sbModalEl, 
            {
                keyboard: false
            }
        );
    }
}