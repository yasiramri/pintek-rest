class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;  // Not Found
    }
}

module.exports = NotFoundError;
