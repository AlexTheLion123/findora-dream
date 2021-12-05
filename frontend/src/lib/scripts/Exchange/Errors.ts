export class ProviderError extends Error {
constructor(message) {
    super(message);
    this.name = "ProviderError"
}
}