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
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("game", "readonly");
            const objectStore = transaction.objectStore("game");
            const allGamesRequest = objectStore.getAll();

            allGamesRequest.onsuccess = () => {
                resolve(allGamesRequest.result);
            };

            allGamesRequest.onerror = () => {
                reject("Error when loading games from indexedDb.");
            };
        });
    }

    roomCreate(parameters) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("room", "readwrite");
            const objectStore = transaction.objectStore("room");
            let id = this.generateUUID();
            let name = parameters['name'];

            if(name.length === 0) {
                name = 'New Room ' + id;
            }

            objectStore.put({id: id, name : name, gameId : parameters['gameId']});

            transaction.oncomplete = () => {
                resolve(id);
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
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

    generateUUID() {
        // Warning. Untested.
        if(typeof window.crypto.randomUUID === 'function') {
            return crypto.randomUUID().replaceAll('-', '');
        }

        // This is a fallback.
        // I used this, because the window.crypto object, which also can generate UUIDs,
        // is not available in a non-https context.
        // Since I used local docker containers with local domains (scoreboard.local for example),
        // I do not want to implement ssl on them, to make life easier.
        // So for now, I decided to use a "custom" uuid v4 generator, which I asked chatgpt for.
        // It is not really testet, so use it with care.
        // As soon as an API is implemented, this will not longer be of use.
        return ([1e7]+1e3+4e3+8e3+1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}