import { User } from '@inspetor/@types/models/user'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { normalizeText } from '@inspetor/utils/normalize-text'
import {
  and,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

export async function getUsersOptions(params: any) {
  const { page, filters, companyId } = params
  const coll = collection(firestore, firebaseModels.users)
  const q = query(
    coll,
    and(
      where('rowNumber', '>=', (page - 1) * appConfigs.limitOfQueries),
      where('search', 'array-contains-any', [
        normalizeText(filters.search) || appConfigs.firestore.emptyString,
      ]),
      where(
        appConfigs.firestore.permissions.byCompanyPropertyName,
        '==',
        companyId,
      ),
    ),
    orderBy('rowNumber'),
    limit(appConfigs.limitOfQueries),
  )

  const users = await getDocs(q)

  return users.docs.map((doc) => {
    const data = doc.data() as User
    return {
      label: data.name,
      value: `${doc.id}|${data.name}|${data.nationalRegister}`,
    }
  })
}
