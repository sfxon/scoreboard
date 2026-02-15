import sbApi from './scoreboard-api.js';
import indexedDb from './../db/db.js';

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
            case 'room/update':
                return this.roomUpdate(parameters);
            case 'player/upsert':
                return this.playerUpsert(parameters);
            case 'players/loadByRoomId':
                return this.playersLoadByRoomId(parameters);
        }
    }

    gameLoad(parameters) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('game', 'readonly');
            const objectStore = transaction.objectStore('game');

            if(parameters.hasOwnProperty('id')) {
                // Load one specific game.
                let gameId = parameters.id;
                let request = objectStore.get(gameId);

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    reject('Error while loading room with id ' + gameId);
                };
            } else {
                // Load list of all rooms.
                const allGamesRequest = objectStore.getAll();

                allGamesRequest.onsuccess = () => {
                    resolve(allGamesRequest.result);
                };

                allGamesRequest.onerror = () => {
                    reject('Error when loading games from indexedDb.');
                };
            }
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

    roomCreate(parameters) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('room', 'readwrite');
            const objectStore = transaction.objectStore('room');
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

    roomUpdate(parameters) {
        if(!parameters.hasOwnProperty('id')) {
            throw new Error('No id set.');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('room', 'readwrite');
            const objectStore = transaction.objectStore('room');

            // Load data from database, because we want to keep the fields, that where not included in the post.
            const request = objectStore.get(parameters.id);

            request.onsuccess = (event) => {
                const data = event.target.result;

                if (!data) {
                    reject('Room not found');
                    return;
                }

                for(let key in parameters) {
                    // @TODO: We could optimize this part of the code, by adding entity definitions.
                    // Then we could always check, if fields really exist, and only save the values, if the given field exists in the entity.
                    data[key] = parameters[key];
                }

                objectStore.put(data);
            };

            transaction.oncomplete = () => {
                resolve(parameters.id);
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }

    roomLoad(parameters) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('room', 'readonly');
            const objectStore = transaction.objectStore('room');

            if(parameters.hasOwnProperty('id')) {
                // Load one specific room.
                let roomId = parameters.id;
                let request = objectStore.get(roomId);

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    reject('Error while loading room with id ' + roomId);
                };
            } else {
                // Load list of all rooms.
                const allRoomsRequest = objectStore.getAll();

                allRoomsRequest.onsuccess = () => {
                    resolve(allRoomsRequest.result);
                };

                allRoomsRequest.onerror = () => {
                    reject('Error while loading rooms.');
                };
            }
        });
    }

    playerUpsert(parameters) {
        if(!parameters.hasOwnProperty('id')) {
            parameters.id = generateUUID();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('player', 'readwrite');
            const objectStore = transaction.objectStore('player');

            // Load data from database, because we want to keep the fields, that where not included in the post.
            const request = objectStore.get(parameters.id);

            request.onsuccess = (event) => {
                let data = event.target.result;

                if (!data) {
                    data = parameters;
                } else {
                    for(let key in parameters) {
                        data[key] = parameters[key];
                    }
                }

                objectStore.put(data);
            };

            transaction.oncomplete = () => {
                resolve(parameters.id);
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }

    playersLoadByRoomId(parameters) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("player", "readonly");
            const objectStore = transaction.objectStore("player");

            if(!parameters.hasOwnProperty('roomId')) {
                reject('Missing roomId.');
            } else {
                // Load list of all rooms.
                const index = objectStore.index('roomId');
                const request = index.getAll(IDBKeyRange.only(parameters.roomId));

                request.onsuccess = () => {
                    resolve(structuredClone(request.result));
                };

                request.onerror = () => {
                    reject("Error while loading players.");
                };
            }
        });
    }
}