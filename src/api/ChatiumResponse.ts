export type ChatiumResponse<T = unknown> = ChatiumSuccessResponse<T> | ErrorResponse

type ChatiumSuccessResponse<T = unknown> = { success: true } & DataResponse<T>
type ErrorResponse = DataErrorResponse

/**
 * Standard plain data response (whole payload should be put in `data` field)
 */
interface DataResponse<T = unknown> {
  data: T
}

/**
 * Standard error shape
 * Can be extended depending on request type, see below
 */
export interface ChatiumErrorResponse extends ChatiumErrorFields {
  success: false
}

export interface ChatiumErrorFields {
  // error class name
  errorType?: string
  // http status code
  statusCode: number
  // usually - error message
  reason: string
  [key: string]: unknown
}

export interface DataErrorResponse extends ChatiumErrorResponse, Partial<DataResponse> {}
