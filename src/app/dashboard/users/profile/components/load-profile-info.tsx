'use client'

import { User } from '@inspetor/@types/models/user'
import { isLoadingProfileAtom, profileAtom } from '@inspetor/atoms/profile'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { useQuery } from '@tanstack/react-query'
import { collection, doc, getDoc } from 'firebase/firestore'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function LoadProfileInfo() {
  const session = useSession()
  const [, setIsLoadingProfile] = useAtom(isLoadingProfileAtom)
  const [, setProfile] = useAtom(profileAtom)

  const { data: profile, isPending } = useQuery({
    queryKey: ['profile', session.data?.user.id],
    queryFn: async () => {
      const coll = collection(firestore, firebaseModels.users)
      const docRef = doc(coll, session.data!.user.id)

      const response = await getDoc(docRef)
      if (!response.exists()) {
        return null
      }

      const userData = response.data() as User
      return {
        ...userData,
        id: response.id,
      }
    },
    enabled: !!session.data?.user.id,
    retry: 3,
  })

  useEffect(() => {
    if (!isPending) {
      if (profile) {
        setProfile(profile)
      }

      setIsLoadingProfile(false)
    }
  }, [isPending, profile, setIsLoadingProfile, setProfile])

  return null
}
