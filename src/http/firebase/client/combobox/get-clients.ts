import { Client } from '@inspetor/@types/models/clients'
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

export async function getClientsOptions(params: any) {
  const { page, filters, companyId } = params
  const coll = collection(firestore, firebaseModels.clients)
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

  const clients = await getDocs(q)

  return clients.docs.map((doc) => {
    const data = doc.data() as Client
    return {
      label: data.name,
      value: `${doc.id}|${data.name}|${data.cnpjOrCpf}`,
    }
  })
}
