import { chatiumPost } from './api/chatiumApiClient'
import { AppCtx } from './context'

export async function triggerHotReload(ctx: AppCtx, backendDomain = 'chatium.com'): Promise<void> {
  const syscallCtx = {
    ...ctx,
    account: {
      id: 1,
      host: backendDomain,
    },
    auth: null,
  }

  await chatiumPost(syscallCtx, `/api/v1/dev/hot-reload/${process.env.DEV_TUNNEL_DOMAIN || ''}`)
}
