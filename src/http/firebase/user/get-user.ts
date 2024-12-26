import { User } from '@inspetor/@types/models/user'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

export async function getUser(userId: string): Promise<User | null> {
  const docRef = doc(firestore, firebaseModels.users, userId)
  const document = await getDoc(docRef)

  if (!document.exists()) {
    return null
  }

  const documentData = document.data() as User
  return {
    ...documentData,
    id: document.id,
  }
}
