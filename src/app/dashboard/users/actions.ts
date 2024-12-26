'use server'

import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { z } from 'zod'
import { createServerAction } from 'zsa'

export const deleteAuthUser = createServerAction()
  .input(
    z.object({
      userId: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const { userId } = input
      const firebase = getFirebaseApps()
      await firebase?.auth.deleteUser(userId)
      return { success: true }
    } catch {
      return { success: false }
    }
  })
