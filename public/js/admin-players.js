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

        // This requires that all DOM Contents are already loaded.
        this.reloadPlayerViews();
        this.initAddPlayerBtnHandler();
    }

    activatePlayer(playerNumber, playerId) {
        // Activate the player in the scoreboard instance.
        this.scoreboard.activatePlayer(playerNumber, playerId);

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
                this.scoreboard.activatePlayer(oddNumber, oldSelectedInput.value);
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

        this.initInputField(newPlayerContainer, 'input.name', player, 'name');
        this.initInputField(newPlayerContainer, 'input.points', player, 'points');
        this.initInputField(newPlayerContainer, 'input.rounds-won', player, 'roundsWon');
        this.initInputField(newPlayerContainer, 'input.lifetime-points', player, 'lifetimePoints');

        this.sbAdminPlayersEl.insertAdjacentElement('beforeend', newPlayerContainer);
        this.initSelectPlayerButtons(newPlayerContainer, player.id);
    }

    capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    initAddPlayerBtnHandler() {
        // Add keyup event handler.
        this.addPlayerBtnEl = document.getElementById(this.addPlayerBtnId);
        this.addPlayerBtnEl.addEventListener('click', async (event) => {
            let room = this.scoreboard.getRoom();
            let player = new sbPlayer(null, "", room.id, 0, 0, 0, 0);
            await this.scoreboard.savePlayer(player);
            this.scoreboard.addPlayer(player);
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

    initInputField(domContainer, cssSelector, player, playerFieldName) {
        let el = domContainer.querySelector(cssSelector);
        el.value = player[playerFieldName];

        let playerMethodName = 'set' + this.capitalizeFirstLetter(playerFieldName);

        el.addEventListener('keyup', (event) => {
            this.inputFieldChangedHandler(domContainer, el, playerMethodName);
        });

        el.addEventListener('change', (event) => {
            this.inputFieldChangedHandler(domContainer, el, playerMethodName);
        });
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
            this.scoreboard.saveActivePlayers();
        });
    }

    async inputFieldChangedHandler(domContainer, el, playerMethodName) {
        let playerId = domContainer.getAttribute('data-attr-player-id');
        this.scoreboard.updatePlayerValue(playerId, playerMethodName, el.value);
        let player = this.scoreboard.getPlayerById(playerId);
        await this.scoreboard.savePlayer(player);
        this.scoreboard.updatePlayerViews();
    }

    reloadPlayerViews() {
        this.removePlayerPanes();
        this.initEditorWithPlayers(this.scoreboard.getRoom().players);
        
        let player1 = this.scoreboard.getRoom().getActivePlayer(1);
        let player2 = this.scoreboard.getRoom().getActivePlayer(2);

        if(player1 !== null && player2 !== null) {
            this.activatePlayer(1, player1.id);
            this.activatePlayer(2, player2.id);
        } else {
            this.activatePlayer(1, this.scoreboard.getRoom().players[0].id);
            this.activatePlayer(2, this.scoreboard.getRoom().players[1].id);
        }
    }

    removePlayerPanes() {
        let sbAdminPlayerEl = document.getElementById('sb-admin-players');
        sbAdminPlayerEl.innerHTML = '';
    }
}