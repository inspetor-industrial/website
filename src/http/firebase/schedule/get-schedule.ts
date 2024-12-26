import { Schedule } from '@inspetor/@types/models/schedule'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

export async function getSchedule(
  scheduleId: string,
): Promise<Schedule | null> {
  const docRef = doc(firestore, firebaseModels.schedules, scheduleId)
  const document = await getDoc(docRef)

  if (!document.exists()) {
    return null
  }

  const documentData = document.data() as Schedule
  return {
    ...documentData,
    id: document.id,
  }
}
