import { appConfigs } from '@inspetor/constants/configs'

export const SentryReactQueryCatcher = (error: Error, query: any) => {
  console.log(error, {
    tags: {
      queryKey: query.queryKey.toString(),
    },
    user: {
      username: appConfigs.defaultUsername,
    },
  })

  return false
}
