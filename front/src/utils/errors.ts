export class ApiFatalError extends Error {
    statusCode: number;
    constructor(message: string) {
        super(message);
        this.name = 'ApiFatalError';
        this.statusCode = 500;
    }
}

export class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number = 418) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}