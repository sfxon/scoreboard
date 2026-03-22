import sbPlayer from './../player.js';

export default class sbAdminPlayers {
    /**
     * @param {*} scoreboard 
     */
    constructor(sbModal, scoreboard) {
        this.sbModal = sbModal;
        this.scoreboard = scoreboard;
        this.hotkeyOverlayEl = null;
        this.hotkeyOverlayId = 'sb-hotkey-input-overlay';
        this.actionInfoEl = null;
        this.actionInfoId = 'sb-hotkey-input-overlay-action-info';
        this.hideEventListener = null; // Hier wird der EventListener gespeichert
        this.fetchInputEventListener = null;
        this.inputElToConfigure = null;
        this.hotkeyIdToConfigure = null;

        this.initHotkeyElements();
        this.initInputFieldsWithCurrentValues();
        this.initChangeButtons();
    }

    addFetchInputKeyListener() {
        this.fetchInputEventListener = (event) => {
            event.stopPropagation();
            event.preventDefault();
            
            // Abort action when escape key was pressed.
            if(event.key === 'Escape') {
                this.hotkeyOverlayEl.style.display = 'none'; // Hide overlay.
                this.removeFetchInputKeyListener();
                this.removeHideModalListener();
                return;
            }

            // Save the selected key in the input box.
            this.inputElToConfigure.value = event.key;

            // Activate the hotkey in the live system.
            this.scoreboard.activateHotkeyInScoreboard(this.hotkeyIdToConfigure, event.key);

            // Save the selected key.
            this.scoreboard.saveHotkeys();
            
            // Close the overlay and activate the default behaviour of the modal.
            this.hotkeyOverlayEl.style.display = 'none'; // Hide overlay.
            this.removeFetchInputKeyListener();
            this.removeHideModalListener();
        }

        document.addEventListener('keyup', this.fetchInputEventListener);
    }

    addHideModalListener() {
        this.hideEventListener = (event) => {
            event.preventDefault(); // Prevents the closing of the bootstrap 5 modal.
        };

        this.sbModal._element.addEventListener('hide.bs.modal', this.hideEventListener);
    }

    initChangeButton(btnEl) {
        btnEl.addEventListener('click', (event) => {
            let targetBtnEl = event.target;
            let wrapperEl = targetBtnEl.closest(".hotkey-row");
            this.inputElToConfigure = wrapperEl.querySelector(".sb-hotkey-input");
            this.hotkeyIdToConfigure = this.inputElToConfigure.getAttribute('data-attr-hotkey-id');

            // Remove the focus from the clicked button, to prevent that it reacts on the enter key, if the enter key is pressed.
            targetBtnEl.blur();

            // Prevent the modal from being closed in the background when a "close" action is performed, since our keyboard input is on top of the modal.
            this.addHideModalListener();

            // Show overlay, that says to press any button to define it as a hotkey. Show info, that the "escape key" will abort this. So the escape key is one key, that cannot be used for that action.
            this.actionInfoEl.innerText = this.hotkeyIdToConfigure;
            this.hotkeyOverlayEl.style.display = 'flex';
            
            // Start event handlers that listen to buttons and stuff.
            this.addFetchInputKeyListener();
        });
    }

    initChangeButtons() {
        let btns = document.querySelectorAll('#sb-admin-modal-tab-hotkeys button.sb-change-hotkey-btn');

        for(let btnEl of btns) {
            this.initChangeButton(btnEl);
        }
    }

    initHotkeyElements() {
        this.hotkeyOverlayEl = document.getElementById(this.hotkeyOverlayId);
        this.actionInfoEl = document.getElementById(this.actionInfoId);
    }

    initInputFieldsWithCurrentValues() {
        let inputEls = document.querySelectorAll('#sb-admin-modal-tab-hotkeys .sb-hotkey-input');

        for(let inputEl of inputEls) {
            let hotkeyId = inputEl.getAttribute('data-attr-hotkey-id');

            if (typeof hotkeyId === 'string' || hotkeyId instanceof String) {
                if(this.scoreboard.myRoom.keyboardShortcuts.hasOwnProperty(hotkeyId)) {
                    let value = this.scoreboard.myRoom.keyboardShortcuts[hotkeyId];
                    inputEl.value = value;
                }
            }
        }
    }

    removeFetchInputKeyListener() {
        if(this.fetchInputEventListener) {
            document.removeEventListener('keyup', this.fetchInputEventListener);
            this.fetchInputEventListener = null;
        }
    }

    removeHideModalListener() {
        if (this.hideEventListener) {
            this.sbModal._element.removeEventListener('hide.bs.modal', this.hideEventListener);
            this.hideEventListener = null;
        }
    }
}