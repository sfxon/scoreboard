export default class sbAdmin {
    /**
     * @param {*} scoreboard 
     */
    constructor(scoreboard) {
        this.roomTitleInputEl = null;
        this.roomTitleInputId = 'sb-room-title-input';
        this.gameTitleInputEl = null;
        this.gameTitleInputId = 'sb-game-title-input';
        this.gameSubtitleInputEl = null;
        this.gameSubtitleInputId = 'sb-game-subtitle-input';
        this.sbModal = null;
        this.sbModalEl = null;
        this.sbModalId = 'admin-modal';
        this.scoreboard = scoreboard;
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
            this.initKeyboardInputHandler();
            this.initGeneralInputFields();
        });
    }

    /**
     * When an inputElement from the general tab has changed it's value.
     */
    generalInputElementChanged(newValue, updatedRoomVariable) {
        this.scoreboard.getRoom()[updatedRoomVariable] = newValue;
        this.scoreboard.updateView();
    }

    /**
     * Initialises the input fields for the "general tab" of the admin dialog.
     */
    initGeneralInputFields() {
        // Get the input elements from the document.
        this.roomTitleInputEl = document.getElementById(this.roomTitleInputId);
        this.gameTitleInputEl = document.getElementById(this.gameTitleInputId);
        this.gameSubtitleInputEl = document.getElementById(this.gameSubtitleInputId);

        // Initially value of room variables in input fields in general tab.
        let room = this.scoreboard.getRoom();
        this.roomTitleInputEl.value = room.roomTitle;
        this.gameTitleInputEl.value = room.gameTitle;
        this.gameSubtitleInputEl.value = room.gameSubtitle;

        // Init the event handlers.
        this.initGeneralInputField(this.roomTitleInputEl, 'roomTitle');
        this.initGeneralInputField(this.gameTitleInputEl, 'gameTitle');
        this.initGeneralInputField(this.gameSubtitleInputEl, 'gameSubtitle');
    }

    /**
     * Initializes the events for an input field of the general tab on the admin modal dialog.
     * @param {*} inputFieldEl 
     * @param {*} updatedRoomVariable 
     */
    initGeneralInputField(inputFieldEl, updatedRoomVariable) {
        inputFieldEl.addEventListener('change', (event) => {
            event.stopPropagation();
            this.generalInputElementChanged(event.target.value, updatedRoomVariable);
        });

        inputFieldEl.addEventListener('keyup', (event) => {
            event.stopPropagation();
            this.generalInputElementChanged(event.target.value, updatedRoomVariable);
        });
    }

    /**
     * Initialise keyboard input handler.
     * Shows or hides the modal dialog.
     */
    initKeyboardInputHandler() {
        // Add keyup event handler.
        document.addEventListener('keyup', (event) => {
            // If no supported key has been pressed, leave the event handler.
            if(event.key !== 'Escape' && event.key !== ' ') {
                return;
            }

            // If the dialog is already open and the escape key is pressed, close the modal.
            if(this.sbModal._isShown === true && event.key === 'Escape' ) {
                this.sbModal.hide();
            } else if(this.sbModal._isShown === false) {
                this.sbModal.show();
            }
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