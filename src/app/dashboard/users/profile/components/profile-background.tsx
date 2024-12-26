'use client'

import ApplicationBackground from '@inspetor/assets/application-background.png'
import { profileAtom } from '@inspetor/atoms/profile'
import {
  ProgressAlertDialog,
  ProgressAlertDialogMethods,
} from '@inspetor/components/progress-alert-dialog'
import { Button } from '@inspetor/components/ui/button'
import { Label } from '@inspetor/components/ui/label'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { firestore, storage } from '@inspetor/lib/firebase/client'
import { collection, doc, updateDoc } from 'firebase/firestore'
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage'
import { useAtom } from 'jotai'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useRef, useState } from 'react'

export function ProfileBackground() {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentUploadTask, setCurrentUploadTask] = useState<UploadTask | null>(
    null,
  )
  const progressAlertDialogRef = useRef<ProgressAlertDialogMethods>(null)
  const session = useSession()

  const [profile, setProfile] = useAtom(profileAtom)

  async function handleUploadBackgroundPhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    event.preventDefault()

    const files = event.target.files
    if (!files || files?.length === 0) {
      return
    }

    const file = files[0]
    const fileSize = file.size / 1024 / 1024
    if (fileSize > 10) {
      toast({
        title: 'Erro com a imagem',
        description: 'A imagem deve ter no máximo 10MB.',
        variant: 'destructive',
      })
      return
    }

    progressAlertDialogRef.current?.open()

    const fileext = file.name.split('.').at(-1)!
    const imagePath = `users/profile/${session.data?.user.id}/background.${fileext}`

    const storageRef = ref(storage, imagePath)
    const uploadTask = uploadBytesResumable(storageRef, file)
    setCurrentUploadTask(uploadTask)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        switch (snapshot.state) {
          case 'running':
            setCurrentProgress(progress)
            break
          default:
            break
        }
      },
      (error) => {
        if (error.code === 'storage/canceled') {
          toast({
            title: 'Upload cancelado',
            description: 'O upload da imagem foi cancelado.',
            variant: 'default',
          })

          progressAlertDialogRef.current?.close()
          return
        }

        toast({
          title: 'Erro ao enviar imagem',
          description: 'Tente novamente mais tarde.',
          variant: 'destructive',
        })

        progressAlertDialogRef.current?.close()
      },
      () => {
        getDownloadURL(storageRef)
          .then(async (downloadUrl) => {
            const coll = collection(firestore, firebaseModels.users)
            const docRef = doc(coll, session.data?.user.id)

            await updateDoc(docRef, {
              ...profile!,
              backgroundPhoto: downloadUrl,
              updatedAt: Date.now(),
              updatedBy: session.data?.user.id,
            })

            setProfile({
              ...profile!,
              backgroundPhoto: downloadUrl,
              updatedAt: Date.now(),
              updatedBy: session.data!.user.id,
            })
          })
          .finally(() => {
            toast({
              title: 'Upload finalizado',
              description: `A imagem '${file.name}' foi enviada com sucesso.`,
              variant: 'success',
            })
            progressAlertDialogRef.current?.close()
          })
      },
    )
  }

  function handleCancelUpload() {
    if (currentUploadTask) {
      const hasPauseEffect = currentUploadTask.pause()
      if (hasPauseEffect) {
        const hasEffect = currentUploadTask.cancel()

        if (hasEffect) {
          toast({
            title: 'Upload cancelado',
            description: 'O upload da imagem foi cancelado.',
            variant: 'destructive',
          })

          setCurrentProgress(0)
          setCurrentUploadTask(null)
          progressAlertDialogRef.current?.close()
        }
      }
    }
  }

  return (
    <div className="w-full relative group">
      <input
        type="file"
        accept="image/*"
        id="profile-background"
        onChange={handleUploadBackgroundPhoto}
        className="hidden"
      />
      <Image
        src={profile?.backgroundPhoto || ApplicationBackground}
        alt="Application Background"
        className="w-full rounded-t-md"
        width={1920}
        height={400}
      />

      <Button
        variant="secondary"
        size="icon"
        className="absolute bottom-2 right-2 rounded group-hover:visible invisible cursor-pointer"
        asChild
      >
        <Label htmlFor="profile-background">
          <Camera className="" />
        </Label>
      </Button>

      <ProgressAlertDialog
        title="Upload Background Foto"
        progress={Math.floor(currentProgress)}
        onCancelUpload={handleCancelUpload}
        ref={progressAlertDialogRef}
      />
    </div>
  )
}
