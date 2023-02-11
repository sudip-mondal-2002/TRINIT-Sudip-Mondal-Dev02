export type CustomErrorResponseUnit = { message: string, field?: string }
export type CustomErrorResponse = CustomErrorResponseUnit[]

export abstract class CustomError extends Error {
    abstract statusCode: number

    protected constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    abstract serializeErrors(): CustomErrorResponse
}