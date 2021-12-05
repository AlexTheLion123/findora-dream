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