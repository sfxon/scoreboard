export default class UuidService {
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
