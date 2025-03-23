'use client'

import type { Document } from '@inspetor/@types/document'
import type { BoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { ImageResizer } from '@inspetor/app/reports/components/image-resizer'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { collection, doc, setDoc } from 'firebase/firestore'

type BackgroundPhotoProps = {
  bottomDischargeSystemChecks: BoilerInspection['bottomDischargeSystemChecks']
  boilerId: string
  isDownload: boolean
}

export function BackgroundPhoto({
  bottomDischargeSystemChecks,
  boilerId,
  isDownload,
}: BackgroundPhotoProps) {
  async function updateImageConfiguration(image: Document) {
    const collDocs = collection(firestore, firebaseModels.documents)
    const collManometer = collection(firestore, firebaseModels.boilerInspection)
    const docManometerRef = doc(collManometer, boilerId)
    const docImageRef = doc(collDocs, image.id)

    await Promise.all([
      setDoc(
        docManometerRef,
        {
          bottomDischargeSystemChecks: {
            ...bottomDischargeSystemChecks,
            photos: bottomDischargeSystemChecks?.photos?.map((doc) =>
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
      {bottomDischargeSystemChecks?.photos &&
        bottomDischargeSystemChecks?.photos.map((image, index) => {
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
