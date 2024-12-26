import { Instrument } from '@inspetor/@types/models/instruments'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

export async function getInstrument(
  instrumentId: string,
): Promise<Instrument | null> {
  const docRef = doc(firestore, firebaseModels.instruments, instrumentId)
  const document = await getDoc(docRef)

  if (!document.exists()) {
    return null
  }

  const documentData = document.data() as Instrument
  return {
    ...documentData,
    id: document.id,
  }
}
