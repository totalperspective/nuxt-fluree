import type { ModuleOptions } from '../../module'
import type { FlureeImpl } from '../../types'

export async function useFluree(config: ModuleOptions): Promise<FlureeImpl> {
  if (process.server) {
    const { useFlureeNode } = await import('./useFlureeNode')
    return await useFlureeNode(config)
  } else {
    const { useFlureeBrowser } = await import('./useFlureeBrowser')
    return await useFlureeBrowser(config)
  }
}
