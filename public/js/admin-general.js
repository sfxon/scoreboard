export default class sbAdminGeneral {
    /**
     * @param {*} scoreboard 
     */
    constructor(sbModal, scoreboard) {
        this.roomNameInputEl = null;
        this.roomNameInputId = 'sb-room-name-input';
        this.roomSubtitleInputEl = null;
        this.roomSubtitleInputId = 'sb-room-subtitle-input';
        this.sbModal = sbModal;
        this.scoreboard = scoreboard;
        this.timerActiveEl = null;
        this.timerActiveId = 'sb-room-timer-active';

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
    generalInputElementChanged(entityName, id, updatedRoomVariable, value) {
        // Update local object.
        this.scoreboard.getRoom()[updatedRoomVariable] = value;

        // Update the view.
        this.scoreboard.updateView();

        // Update object in database.
        let data = {};
        data['id'] = id;
        data[updatedRoomVariable] = value;
        this.scoreboard.api.post(entityName + '/update', data);
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
        this.roomNameInputEl = document.getElementById(this.roomNameInputId);
        this.roomSubtitleInputEl = document.getElementById(this.roomSubtitleInputId);
        this.timerActiveEl = document.getElementById(this.timerActiveId);

        // Initially value of room variables in input fields in general tab.
        let room = this.scoreboard.getRoom();
        this.roomNameInputEl.value = room.name;
        this.roomSubtitleInputEl.value = room.subtitle;

        // Init the event handlers.
        this.initGeneralInputField('room', room.id, 'name', this.roomNameInputEl);
        this.initGeneralInputField('room', room.id, 'subtitle', this.roomSubtitleInputEl);
        this.initGeneralSwitchField('room', room.id, 'timerActive', this.timerActiveEl);
    }

    /**
     * Initializes the events for an input field of the general tab on the admin modal dialog.
     * @param {*} inputFieldEl 
     * @param {*} updatedRoomVariable 
     */
    initGeneralInputField(entityName, id, updatedRoomVariable, inputFieldEl) {
        inputFieldEl.addEventListener('change', (event) => {
            event.stopPropagation();
            this.generalInputElementChanged(entityName, id, updatedRoomVariable, event.target.value);
        });

        inputFieldEl.addEventListener('keyup', (event) => {
            event.stopPropagation();
            this.generalInputElementChanged(entityName, id, updatedRoomVariable, event.target.value);
        });
    }

    initGeneralSwitchField(entityName, id, updatedRoomVariable, inputFieldEl) {
        inputFieldEl.addEventListener('change', (event) => {
            event.stopPropagation();
            let bState = event.target.checked;
            let iState = 0;

            if(bState === true) {
                iState = 1;
            }

            this.generalInputElementChanged(entityName, id, updatedRoomVariable, iState);
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