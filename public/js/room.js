import sbPlayer from './player.js';

export default class sbRoom {
    constructor(
        roomTitle = "Room 1", 
        gameTitle = "My Game",
        gameSubtitle = "My Subtitle",
        players = []
    ) {
        this.roomTitle = roomTitle;
        this.gameTitle = gameTitle;
        this.gameSubtitle = gameSubtitle;
        this.players = players;

        if(this.players.length === 0) {
            this.players.push(new sbPlayer(null, 'Home', 0, 0));
            this.players.push(new sbPlayer(null, 'Visitor', 0, 0));
        }
    }
}