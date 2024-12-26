import { Valve } from '@inspetor/@types/models/valve'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

export async function getValve(valveId: string): Promise<Valve | null> {
  const docRef = doc(firestore, firebaseModels.valves, valveId)
  const document = await getDoc(docRef)

  if (!document.exists()) {
    return null
  }

  const documentData = document.data() as Valve
  return {
    ...documentData,
    id: document.id,
  }
}
