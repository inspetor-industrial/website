import { appConfigs } from '@inspetor/constants/configs'

type SimpleFunctionCallback = () => void
type NotificationFunctionCallback = (this: Notification, ev: Event) => void

interface CopyToClipboardOptions {
  notification?: boolean
  notificationText?: string
  notificationAction?: NotificationFunctionCallback | SimpleFunctionCallback

  parser?: (text: any) => string

  entity?: string
}

export async function copyToClipboard(
  text: any,
  options?: CopyToClipboardOptions,
) {
  if (navigator.clipboard) {
    const {
      notification = true,
      entity = 'Texto',
      notificationAction,
      notificationText,
      parser,
    } = options ?? {}

    try {
      const isObject = typeof text === 'object'
      if (isObject) {
        delete text[appConfigs.firestore.searchProperty]
      }

      if (parser) {
        text = parser(text)
      } else if (isObject) {
        text = JSON.stringify(text, null, 2)
      }

      await navigator.clipboard.writeText(text)

      let notificationTextToShow = 'Texto copiado para a área de transferência!'
      if (isObject) {
        notificationTextToShow = 'JSON copiado para a área de transferência!'
      }

      if (entity) {
        notificationTextToShow = `${entity} copiado para a área de transferência!`
      }

      if (notificationText) {
        notificationTextToShow = notificationText
      }

      if (notification) {
        const notification = new window.Notification(
          appConfigs.applicationName,
          {
            body: notificationTextToShow,
          },
        )

        if (notificationAction) {
          notification.onclick = notificationAction
        }
      }
    } catch (e) {
      console.error('Failed to copy to clipboard', e)
    }
  } else {
    console.error('Clipboard API not available')
  }
}
