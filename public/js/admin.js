document.addEventListener('DOMContentLoaded', function () {
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