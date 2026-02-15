import PlayerDto from './dto/player-dto.js';
import UuidService from './service/uuid-service.js';

export default class sbPlayer {
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
        this.uuidService = new UuidService();

        if(this.id === null) {
            this.id = this.uuidService.generateUUID();
        }

        this.name = name;
        this.roomId = roomId;
        this.points = parseInt(points);
        this.lifetimePoints = parseInt(lifetimePoints);
        this.roundsWon = roundsWon;
        this.lifetimeRoundsWon = lifetimeRoundsWon;
    }

    addLifetimePoints(pointsToAdd) {
        pointsToAdd = parseInt(pointsToAdd);
        
        if(pointsToAdd > 0) {
            this.lifetimePoints += pointsToAdd;
        }
    }

    addPoints(pointsToAdd) {
        // Here only the points of the running round are added.
        // Total points will only be added, when the round is finished.
        pointsToAdd = parseInt(pointsToAdd);
        this.points += pointsToAdd;
    }

    addRoundsWon() {
        this.roundsWon += 1;
    }

    getDto() {
        let dto = new PlayerDto(this.id, this.name, this.roomId, this.points, this.lifetimePoints, this.roundsWon, this.lifetimeRoundsWon);
        return dto;
    }

    reducePoints(pointsToReduce) {
        // Here only the points of the running round are added.
        // Total points will only be added, when the round is finished.
        pointsToReduce = parseInt(pointsToReduce);
        this.points -= pointsToReduce;
    }

    reduceRoundsWon() {
        this.roundsWon -= 1;
    }

    setLifetimePoints(lifetimePoints) {
        this.lifetimePoints = this.getParsedNumberOrZero(lifetimePoints);
    }

    setName(name) {
        this.name = name;
    }

    setPoints(points) {
        this.points = this.getParsedNumberOrZero(points);
    }

    setRoundsWon(roundsWon) {
        this.roundsWon = this.getParsedNumberOrZero(roundsWon);
    }

    getParsedNumberOrZero(value) {
        value = parseInt(value);

        if(isNaN(value)) {
            return 0;
        }

        return value;
    }
}