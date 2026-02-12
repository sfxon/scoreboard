export default class sbAdminGeneral {
    /**
     * @param {*} scoreboard 
     */
    constructor(sbModal, scoreboard) {
        this.gameNameInputEl = null;
        this.gameNameInputId = 'sb-game-name-input';
        this.roomNameInputEl = null;
        this.roomNameInputId = 'sb-room-name-input';
        this.roomSubtitleInputEl = null;
        this.roomSubtitleInputId = 'sb-room-subtitle-input';
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
        this.gameNameInputEl = document.getElementById(this.gameNameInputId);
        this.roomNameInputEl = document.getElementById(this.roomNameInputId);
        this.roomSubtitleInputEl = document.getElementById(this.roomSubtitleInputId);

        // Initially value of room variables in input fields in general tab.
        let room = this.scoreboard.getRoom();
        this.gameNameInputEl.value = room.gameName;
        this.roomNameInputEl.value = room.roomName;
        this.roomSubtitleInputEl.value = room.roomSubtitle;

        // Init the event handlers.
        this.initGeneralInputField(this.gameNameInputEl, 'gameName');
        this.initGeneralInputField(this.roomNameInputEl, 'roomName');
        this.initGeneralInputField(this.roomSubtitleInputEl, 'roomSubtitle');
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