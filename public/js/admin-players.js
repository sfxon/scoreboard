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
        this.initEditorWithPlayers(scoreboard.getRoom().players);
        this.initAddPlayerBtnHandler();
    }

    initAddPlayerBtnHandler() {
        // Add keyup event handler.
        this.addPlayerBtnEl = document.getElementById(this.addPlayerBtnId);
        this.addPlayerBtnEl.addEventListener('click', (event) => {
            alert('TODO: Implement logic.');
        });
    }

    initEditorWithPlayers(players) {
        this.sbAdminPlayersEl = document.getElementById(this.sbAdminPlayersId);
        this.sbAdminPlayerTemplateEl = document.getElementById(this.sbAdminPlayerTemplateId);
        let template = this.sbAdminPlayerTemplateEl.innerHTML;

        for(let player of players) {
            let templateObj = document.createElement('template');
            templateObj.innerHTML = template;

            let newPlayerContainer = templateObj.content.firstElementChild;
            newPlayerContainer.querySelector('input.name').value = player.name;

            this.sbAdminPlayersEl.insertAdjacentElement('beforeend', newPlayerContainer);
        }
    }
}