export abstract class ChatiumError extends Error {
  abstract readonly statusCode: number
}

export class NotFoundError extends ChatiumError {
  readonly statusCode = 404
  constructor(readonly type: string, readonly id: string | number) {
    super(`'${id}' is not found in '${type}'`)
  }
}
