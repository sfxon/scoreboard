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

        this.initHotkeyElements();
        // this.initInputFieldsWithCurrentValues();
        this.initChangeButtons();
    }

    initChangeButton(btnEl) {
        btnEl.addEventListener('click', (event) => {
            let targetBtnEl = event.target;
            let wrapperEl = targetBtnEl.closest(".hotkey-row");
            let inputEl = wrapperEl.querySelector(".sb-hotkey-input");
            let hotkeyId = inputEl.getAttribute('data-attr-hotkey-id');

            // Show overlay, that says to press any button to define it as a hotkey. Show info, that the "escape key" will abort this. So the escape key is one key, that cannot be used for that action.
            console.log('hotkeyOverlayEl: ', this.hotkeyOverlayEl);
            this.actionInfoEl.innerText = hotkeyId;
            this.hotkeyOverlayEl.style.display = 'flex';
            // Start event handlers that listen to buttons and stuff.
            // 
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
}