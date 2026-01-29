import sbPlayer from './player.js';

export default class sbAdminPlayers {
    /**
     * @param {*} scoreboard 
     */
    constructor(sbModal, scoreboard) {
        this.addPlayerBtnEl = null;
        this.addPlayerBtnId = 'sb-admin-add-player';
        this.sbAdminPlayersEl = null;
        this.sbAdminPlayersId = 'sb-admin-players';
        this.sbAdminPlayerTemplateEl = null;
        this.sbAdminPlayerTemplateId = 'sb-admin-player-template';
        this.sbModal = sbModal;
        this.scoreboard = scoreboard;

        // This requires that all DOM Contents are already fired.
        // The class that instantiates this, has to take care of this.
        // An alternative way would be, to wrap this in // document.addEventListener('DOMContentLoaded', () => {
        this.initEditorWithPlayers(this.scoreboard.getRoom().players);
        this.initAddPlayerBtnHandler();

        this.activatePlayer(1, this.scoreboard.getRoom().players[0].id);
        this.activatePlayer(2, this.scoreboard.getRoom().players[1].id);
    }

    activatePlayer(playerNumber, playerId) {
        // TODO: Activate the player in the scoreboard instance.

        // Get the button, that is currently "active".
        let oldSelectedInput = document.querySelector('.sb-admin-player .btn-select-as-player-' + playerNumber + '-value:checked');

        if(oldSelectedInput !== null) {
            oldSelectedInput.checked = false;
        }

        // Get the input that should be activated.
        let selectedPlayerElement = document.getElementById('btn-select-player-' + playerId + '-' + playerNumber + '-value');

        // Check, if there would be 2 buttons activated on the same element, and switch the other button to the old element,
        // that had the activation before.
        let oddNumber = 1;

        if(playerNumber == 1) {
            oddNumber = 2;
        }

        let oddPlayerInput = document.getElementById('btn-select-player-' + playerId + '-' + oddNumber + '-value');

        if(oddPlayerInput.checked === true) {
            if(oldSelectedInput !== null) {
                let oddOldSelectedInput = document.getElementById('btn-select-player-' + oldSelectedInput.value + '-' + oddNumber + '-value');
                oddOldSelectedInput.checked = true;
            }

            oddPlayerInput.checked = false;
        }

        // Activate the button that was clicked.
        selectedPlayerElement.checked = 'checked';
    }

    addPlayerToEditor(player) {
        let templateObj = document.createElement('template');
        let template = this.sbAdminPlayerTemplateEl.innerHTML;
        templateObj.innerHTML = template;

        let newPlayerContainer = templateObj.content.firstElementChild;
        newPlayerContainer.setAttribute('data-attr-player-id', player.id);
        newPlayerContainer.querySelector('input.name').value = player.name;
        newPlayerContainer.querySelector('input.points').value = player.points;
        newPlayerContainer.querySelector('input.lifetime-points').value = player.lifetimePoints;

        this.sbAdminPlayersEl.insertAdjacentElement('beforeend', newPlayerContainer);
        this.initSelectPlayerButtons(newPlayerContainer, player.id);
    }

    initAddPlayerBtnHandler() {
        // Add keyup event handler.
        this.addPlayerBtnEl = document.getElementById(this.addPlayerBtnId);
        this.addPlayerBtnEl.addEventListener('click', (event) => {
            let player = new sbPlayer(null, "", 0, 0);
            this.addPlayerToEditor(player);
        });
    }

    initEditorWithPlayers(players) {
        this.sbAdminPlayersEl = document.getElementById(this.sbAdminPlayersId);
        this.sbAdminPlayerTemplateEl = document.getElementById(this.sbAdminPlayerTemplateId);
        

        for(let player of players) {
            this.addPlayerToEditor(player);
        }
    }

    initSelectPlayerButtons(newPlayerContainer, playerId) {
        this.initSelectPlayerButton(newPlayerContainer, 1, playerId);
        this.initSelectPlayerButton(newPlayerContainer, 2, playerId);
    }

    initSelectPlayerButton(playerContainer, playerNumber, playerId) {
        let btn = playerContainer.querySelector('.btn-select-as-player-' + playerNumber);
        let input = playerContainer.querySelector('.btn-select-as-player-' + playerNumber + '-value');

        btn.id = 'btn-select-player-' + playerId + '-' + playerNumber;
        input.id = 'btn-select-player-' + playerId + '-' + playerNumber + '-value';
        input.name = 'btn-select-player-' + playerNumber;
        input.value = playerId;
        btn.htmlFor = input.id;

        btn.addEventListener('click', (event) => {
            this.activatePlayer(playerNumber, playerContainer.getAttribute('data-attr-player-id'));
        });
    }
}