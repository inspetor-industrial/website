import { Company } from '@inspetor/@types/models/company'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

export async function getCompany(companyId: string): Promise<Company | null> {
  const docRef = doc(firestore, firebaseModels.companies, companyId)
  const document = await getDoc(docRef)

  if (!document.exists()) {
    return null
  }

  const documentData = document.data() as Company
  return {
    ...documentData,
    id: document.id,
  }
}
