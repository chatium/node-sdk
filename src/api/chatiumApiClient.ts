import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { sign } from 'jsonwebtoken'

import { AccountCtx, AppCtx, AuthCtx } from '../context'
import { ChatiumResponse } from './ChatiumResponse'

export function chatiumGet<R = unknown>(ctx: AccountCtx & AppCtx & AuthCtx, url: string): Promise<R> {
  return chatiumRequest<R>(ctx, 'get', url, {})
}

export function chatiumPost<R = unknown, P = unknown>(
  ctx: AccountCtx & AppCtx & AuthCtx,
  url: string,
  params?: P,
): Promise<R> {
  return chatiumRequest<R>(ctx, 'post', url, { data: params })
}

/**
 * DRY function for any chatium api request
 */
async function chatiumRequest<R = unknown>(
  ctx: AccountCtx & AppCtx & AuthCtx,
  method: LowerMethod,
  url: string,
  config: AxiosRequestConfig,
): Promise<R> {
  const accountUrl = 'https://' + ctx.account.host + (url.startsWith('/') ? '' : '/') + url

  const requestResult: AxiosResponse<ChatiumResponse<R>> = await axios({
    method,
    url: accountUrl,
    headers: {
      'x-chatium-api-key': ctx.app.apiKey,
      authorization: createChatiumApiToken(ctx, method, accountUrl),
    },
    ...config,
  })

  if (requestResult.data.success) {
    return requestResult.data.data
  } else {
    throw new Error(
      `Error response from chatium backend on ${requestResult.config.method?.toUpperCase()} ` +
        `${requestResult.config.url} (${requestResult.data.statusCode}): ${requestResult.data.reason}`,
    )
  }
}

function createChatiumApiToken(ctx: AuthCtx & AppCtx, method: LowerMethod, url: string): string {
  return sign({ authToken: ctx.auth.requestToken, iat: Math.ceil(Date.now() / 1000) }, ctx.app.apiSecret + method + url)
}

type LowerMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'
