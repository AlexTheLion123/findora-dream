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
        this.name = "Router address not set"
    }
}

export class RouterDNE extends Error {
    constructor(message) {
        super(message);
        this.name = "Router does not exist"
    }
}

export class FactoryDNE extends Error {
    constructor(message) {
        super(message);
        this.name = "Factory does not exist"
    }
}