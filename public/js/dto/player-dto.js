export default class PlayerDto {
    constructor(
        id,
        name,
        roomId,
        points,
        lifetimePoints,
        roundsWon,
        lifetimeRoundsWon
    ) {
        this.id = id;
        this.name = name;
        this.roomId = roomId;
        this.points = points;
        this.lifetimePoints = lifetimePoints;
        this.roundsWon = roundsWon;
        this.lifetimeRoundsWon = lifetimeRoundsWon;

    }
}