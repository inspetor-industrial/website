import { Client } from '@inspetor/@types/models/clients'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

export async function getClient(clientId: string): Promise<Client | null> {
  const docRef = doc(firestore, firebaseModels.clients, clientId)
  const document = await getDoc(docRef)

  if (!document.exists()) {
    return null
  }

  const documentData = document.data() as Client
  return {
    ...documentData,
    id: document.id,
  }
}
