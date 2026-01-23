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

    /**
     * Updates the display.
     */
    updateView() {
        this.gameTitleEl.innerHTML = this.myRoom.gameTitle;
        this.gameSubtitleEl.innerHTML = this.myRoom.gameSubtitle;
    }
}