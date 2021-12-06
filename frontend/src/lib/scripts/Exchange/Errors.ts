export class ProviderError extends Error {
    constructor(message) {
        super(message);
        this.name = "ProviderError"
    }
}

export class SignerError extends Error {
    constructor(message) {
        super(message);
        this.name = "SignerError"
    }
}

export class RouterAddressNotSetError extends Error {
    constructor(message) {
        super(message);
        this.name = "RouterNotSetError"
    }
}

export class RouterDNE extends Error {
    constructor(message) {
        super(message);
        this.name = "RouterDNE"
    }
}

export class FactoryDNE extends Error {
    constructor(message) {
        super(message);
        this.name = "FactoryDNE"
    }
}

export class NoRouteError extends Error {
    constructor(message) {
        super(message);
        this.name = "NoRouteError"
    }
}