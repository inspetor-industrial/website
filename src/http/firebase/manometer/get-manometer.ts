import { Manometer } from '@inspetor/@types/models/manometer'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

export async function getManometer(
  manometerId: string,
): Promise<Manometer | null> {
  const docRef = doc(firestore, firebaseModels.manometers, manometerId)
  const document = await getDoc(docRef)

  if (!document.exists()) {
    return null
  }

  const documentData = document.data() as Manometer
  return {
    ...documentData,
    id: document.id,
  }
}
