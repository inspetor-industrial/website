'use client'

import type { Document } from '@inspetor/@types/document'
import type { BoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { ImageResizer } from '@inspetor/app/reports/components/image-resizer'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { collection, doc, setDoc } from 'firebase/firestore'

type PhotoRecordsProps = {
  examinationsPerformed: BoilerInspection['examinationsPerformed']
  boilerId: string
  isDownload: boolean
}

export function PhotoRecords({
  examinationsPerformed,
  boilerId,
  isDownload,
}: PhotoRecordsProps) {
  async function updateImageConfiguration(image: Document) {
    const collDocs = collection(firestore, firebaseModels.documents)
    const collManometer = collection(firestore, firebaseModels.boilerInspection)
    const docManometerRef = doc(collManometer, boilerId)
    const docImageRef = doc(collDocs, image.id)

    await Promise.all([
      setDoc(
        docManometerRef,
        {
          examinationsPerformed: {
            ...examinationsPerformed,
            record: examinationsPerformed?.record?.map((doc) =>
              doc.id === image.id ? image : doc,
            ),
          },
        },
        {
          merge: true,
          mergeFields: ['documents'],
        },
      ),
      setDoc(docImageRef, image, { merge: true }),
    ])
  }

  return (
    <div className="w-full flex items-center justify-center flex-wrap">
      {examinationsPerformed?.book &&
        examinationsPerformed?.book.map((image, index) => {
          return (
            <ImageResizer
              key={image.id}
              image={image}
              reportId={boilerId}
              imageIndex={index}
              onUpdate={updateImageConfiguration}
              pagePreview={Boolean(isDownload)}
              boxSize={appConfigs.defaultBoxSize}
            />
          )
        })}
    </div>
  )
}
