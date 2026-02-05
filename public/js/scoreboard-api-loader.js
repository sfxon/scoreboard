import sbLocalApiEndpoint from './local-api-endpoint.js';

export default class sbScoreboardIndex {
    constructor(
        implementationName
    ) {
        this.implementationName = implementationName;
        this.apiInstance = null;
    }

    getApi() {
        return this.apiInstance;
    }

    async loadImplementation() {
        switch(this.implementationName) {
            case 'sbLocalApiEndpoint':
                this.apiInstance = new sbLocalApiEndpoint();
                await this.apiInstance.init();
                break;
            default:
                throw new Error("Unkown api implementation with name " + this.implementationName);
        }
    }
}