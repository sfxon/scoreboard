import sbRoom from './room.js';

export function admin() {
    // Create the room element
    const myRoom = new sbRoom();
    const roomTitleInputId = 'sb-room-title-input';
    const gameTitleId = 'sb-title';
    const gameTitleInputId = 'sb-game-title-input';
    const gameSubtitleId = 'sb-subtitle';
    const gameSubtitleInputId = 'sb-game-subtitle-input';

    // Hook everything togehter, when the DOM loading is finished.
    document.addEventListener('DOMContentLoaded', function () {
        // Init room values in editor and website.
        // -> TODO: initFrontend()  -> Initialises the website code (not the admin).
        // -> TODO: init


        
        // Show modal, when page is initially loaded.
        const sbModalEl = document.getElementById('admin-modal');
        const sbModal = new bootstrap.Modal(
            sbModalEl, 
            {
                keyboard: false
            }
        );

        sbModal.show();

        // Add keyup event handler.
        document.addEventListener('keyup', (event) => {
            // If no supported key has been pressed, leave the event handler.
            if(event.key !== 'Escape' && event.key !== ' ') {
                return;
            }

            // If the dialog is already open and the escape key is pressed, close the modal.
            if(sbModal._isShown === true && event.key === 'Escape' ) {
                sbModal.hide();
            } else if(sbModal._isShown === false) {
                sbModal.show();
            }
        });
    });
}