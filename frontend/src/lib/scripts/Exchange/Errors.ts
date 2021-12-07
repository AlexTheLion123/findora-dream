export class ProviderError extends Error { // TODO remove either this or SignerError, only need one I think
    constructor(message: string) {
        super(message);
        this.name = "ProviderError"
    }
}

export class SignerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SignerError"
    }
}

export class NoMetaMaskError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SignerError"
    }
}

export class RouterAddressNotSetError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RouterNotSetError"
    }
}

export class RouterDNE extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RouterDNE"
    }
}

export class FactoryDNE extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FactoryDNE"
    }
}

export class RouteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RouteError"
        this.message = "There is a problem with the route"
    }
}

export class SamePairError extends RouteError {
    constructor(){
        const str = "Same pair"
        super(str);
        this.name = "SamePairError"
        this.message = "Same pair"
    }
}

export class NoRouteError extends RouteError {
    constructor() {
        const str = "No route exists"
        super(str)
        this.name = "NoRouteError"
        this.message = "No route exists between the pair"
    }
}