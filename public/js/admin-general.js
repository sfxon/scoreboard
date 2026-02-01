export default class sbAdminGeneral {
    /**
     * @param {*} scoreboard 
     */
    constructor(sbModal, scoreboard) {
        this.roomTitleInputEl = null;
        this.roomTitleInputId = 'sb-room-title-input';
        this.gameTitleInputEl = null;
        this.gameTitleInputId = 'sb-game-title-input';
        this.gameSubtitleInputEl = null;
        this.gameSubtitleInputId = 'sb-game-subtitle-input';
        this.sbModal = sbModal;
        this.scoreboard = scoreboard;

        // This requires that all DOM Contents are already fired.
        // The class that instantiates this, has to take care of this.
        // An alternative way would be, to wrap this in // document.addEventListener('DOMContentLoaded', () => {
        this.initKeyboardInputHandler();
        this.initGeneralInputFields();
        this.initButtonEventHandlers();
    }

    /**
     * When an inputElement from the general tab has changed it's value.
     */
    generalInputElementChanged(newValue, updatedRoomVariable) {
        this.scoreboard.getRoom()[updatedRoomVariable] = newValue;
        this.scoreboard.updateView();
    }

    initButtonEventHandlers() {
        document.getElementById('round-end-button')?.addEventListener('click', () => {
            this.scoreboard.endRound();
        });

        document.getElementById('round-reset-button')?.addEventListener('click', () => {
            this.scoreboard.resetRound();
        });

        // round-start-button
        document.getElementById('round-start-button')?.addEventListener('click', () => {
            alert('start timer');
        });

        // round-start-button
        document.getElementById('round-end-button')?.addEventListener('click', () => {
            alert('end round');
        });

        // round-pause-button
        document.getElementById('round-pause-button')?.addEventListener('click', () => {
            alert('pause timer');
        });
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
            if(event.key !== 'Escape') {
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
}