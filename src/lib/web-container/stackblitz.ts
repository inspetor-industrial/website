import { WebContainer } from '@webcontainer/api'

let stackBlitzWebContainer: WebContainer | null = null

export async function getStackBlitzWebContainer(): Promise<WebContainer> {
  if (stackBlitzWebContainer) {
    return stackBlitzWebContainer
  }

  stackBlitzWebContainer = await WebContainer.boot()
  return stackBlitzWebContainer
}
