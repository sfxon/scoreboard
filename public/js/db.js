export default class db {
    constructor() {
        this.indexedDb = null;
        this.db = null;
    }

    load() {
        return new Promise((resolve, reject) => {
            // Load object. Try for a couple of common browsers.
            this.indexedDb = 
                window.indexedDB ||
                window.mozIndexedDB ||
                window.webkitIndexedDB ||
                window.msIndexedDB ||
                window.shimIndexedDB;

            if (!this.indexedDb) {
                reject(new Error('IndexedDB is not supported by this browser.'));
                return;
            }

            const request = this.indexedDb.open("ScoreboardDatabase", 1); // DBName, Version of Database.

            request.onerror = (event) => {
                reject(new Error('An error occurred with IndexedDB: ' + event));
            };

            // Create or update schema of the database.
            request.onupgradeneeded = (event) => {
                const db = event.target.result; // Result of the open request.

                const gameStore = db.createObjectStore('game', { keyPath: 'id'});
                gameStore.createIndex('name', ['name'], {unique: false });
                //gameStore.put({ id: '1', name: "Cornhole" });

                const roomStore = db.createObjectStore('room', { keyPath: 'id'});
                roomStore.createIndex('name', ['name'], {unique: false });
                roomStore.createIndex('gameId', ['gameId'], {unique: false });
                //roomStore.put({ id: '1', gameId: '1', name: "New Room" });

                const playerStore = db.createObjectStore('player', { keyPath: 'id' });
                playerStore.createIndex('name', ['name'], {unique: false });
                playerStore.createIndex('roomId', ['roomId'], {unique: false});
                playerStore.createIndex('points', ['points'], { unique: false });
                playerStore.createIndex('lifetimePoints', ['lifetimePoints'], { unique: false });
                playerStore.createIndex('roundsWon', ['roundsWon'], { unique: false }); 
                playerStore.createIndex('lifetimeRoundsWon', ['lifetimeRoundsWon'], { unique: false });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db); // Resolve the promise with the database object.
            };
        });
    }

    getDb() {
        return this.db;
    }
}