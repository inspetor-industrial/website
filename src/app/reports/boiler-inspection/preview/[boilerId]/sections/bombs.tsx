'use client'

import type { Document } from '@inspetor/@types/document'
import type { BoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { ImageResizer } from '@inspetor/app/reports/components/image-resizer'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { firestore } from '@inspetor/lib/firebase/client'
import { collection, doc, setDoc } from 'firebase/firestore'

type BombsPhotosProps = {
  powerSupply: BoilerInspection['powerSupply']
  boilerId: string
  isDownload: boolean
}

export function BombsPhotos({
  powerSupply,
  boilerId,
  isDownload,
}: BombsPhotosProps) {
  async function updateImageConfiguration(bombIndex: number, image: Document) {
    const collDocs = collection(firestore, firebaseModels.documents)
    const collBoiler = collection(firestore, firebaseModels.boilerInspection)
    const docBoilerRef = doc(collBoiler, boilerId)
    const docImageRef = doc(collDocs, image.id)
    const updatedBombs = [...(powerSupply?.bombs || [])]

    if (updatedBombs[bombIndex]) {
      updatedBombs[bombIndex] = {
        ...updatedBombs[bombIndex],
        photos: (updatedBombs[bombIndex].photos || []).map((photo) =>
          photo.id === image.id ? image : photo,
        ),
      }
    }

    await Promise.all([
      setDoc(
        docBoilerRef,
        {
          powerSupply: {
            ...powerSupply,
            bombs: updatedBombs,
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

  if (!powerSupply?.bombs || powerSupply.bombs.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {powerSupply.bombs.map(
        (bomb, bombIndex) =>
          bomb.photos &&
          bomb.photos.length > 0 && (
            <div
              key={bombIndex}
              className="flex items-center justify-center flex-wrap mt-4"
            >
              {bomb.photos.map((image, imageIndex) => (
                <ImageResizer
                  key={image.id}
                  image={image}
                  reportId={boilerId}
                  imageIndex={imageIndex}
                  onUpdate={(updatedImage) =>
                    updateImageConfiguration(bombIndex, updatedImage)
                  }
                  pagePreview={Boolean(isDownload)}
                  boxSize={appConfigs.defaultBoxSize}
                />
              ))}
            </div>
          ),
      )}
    </div>
  )
}
