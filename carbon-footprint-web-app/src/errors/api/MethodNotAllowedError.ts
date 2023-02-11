import {CustomError} from "./CustomError";
import {HttpStatus} from "../../enums";

export class MethodNotAllowedError extends CustomError {
    statusCode = HttpStatus.METHOD_NOT_ALLOWED

    constructor() {
        super("Method Not Allowed")
        Object.setPrototypeOf(this, MethodNotAllowedError.prototype)
    }

    serializeErrors() {
        return [{message: this.message}]
    }
}