import sbApi from './scoreboard-api.js';
import indexedDb from './db.js';

export default class sbLocalApiEndpoint extends sbApi {
    constructor() {
        super();
        this.indexedDb = null;
        this.db = null;
    }

    async init() {
        this.indexedDb = new indexedDb();
        this.db = await this.indexedDb.load();
    }

    async post(path, parameters) {
        switch(path) {
            case 'game/load':
                return this.gameLoad(parameters);
            case 'room/create':
                return this.roomCreate(parameters);
            case 'room/load':
                return this.roomLoad(parameters);
        }
    }

    gameLoad(parameters) {
        alert('gamesLoad');
    }

    roomCreate(parameters) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("room", "readwrite");
            const objectStore = transaction.objectStore("room");
            objectStore.put({id: 1, name : 'test', gameId : 1});
        });
    }

    roomLoad(parameters) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("room", "readonly");
            const objectStore = transaction.objectStore("room");
            const allRoomsRequest = objectStore.getAll();

            allRoomsRequest.onsuccess = () => {
                resolve(allRoomsRequest.result);
            };

            allRoomsRequest.onerror = () => {
                reject("Fehler beim Abrufen der Räume");
            };
        });
    }
}