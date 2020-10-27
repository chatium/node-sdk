import { attachMedia, AttachMediaAction } from '@chatium/json'

import { AccountCtx } from './context'

export function chatiumFsAttachMedia(ctx: AccountCtx, props: Parameters<typeof attachMedia>[1]): AttachMediaAction {
  return attachMedia(chatiumFsUploadEndpoint(ctx), props)
}

export function chatiumFsThumbnailUrl(hash: string, width?: number, height?: number): string {
  if ((!width && !height) || (width && height && !(width > 0 && height > 0))) {
    width = 600
    height = undefined
  }
  const size = (width ? width : '') + 'x' + (height ? height : '')

  return `${fileServiceHost}/fileservice/file/thumbnail/h/${hash}/s/${size}`
}

function chatiumFsUploadEndpoint(ctx: AccountCtx): string {
  return fileServiceHost + '/upload?accountId=' + ctx.account.id
}

const fileServiceHost = `https://fs.chatium.io`
