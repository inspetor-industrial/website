import { Document } from '@inspetor/@types/document'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { firestore, storage } from '@inspetor/lib/firebase/client'
import { cn } from '@inspetor/lib/utils'
import { formatFileSize } from '@inspetor/utils/format-filesize'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage'
import { CloudDownload, File, ScanSearch, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ChangeEvent, ComponentProps, useRef, useState } from 'react'

import {
  ProgressAlertDialog,
  ProgressAlertDialogMethods,
} from './progress-alert-dialog'
import { inputVariants } from './ui/input'

type InputProps = ComponentProps<'input'>
type DocumentFieldProps = Omit<InputProps, 'onChange' | 'value'> & {
  baseFolderToUpload?: string
  isOnModal?: boolean
  onChange?: (data: Document[]) => void
  value?: Document[]
  max?: number
}

export function DocumentField({
  className,
  placeholder,
  onChange,
  value: documents = [],
  isOnModal = false,
  baseFolderToUpload = 'inspetor-base-folder',
  max: MAX_OF_FILES = 2,
  ...props
}: DocumentFieldProps) {
  const session = useSession()

  const fieldId = props.id || crypto.randomUUID()
  const alertProgressRef = useRef<ProgressAlertDialogMethods>(null)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentUploadTask, setCurrentUploadTask] = useState<UploadTask | null>(
    null,
  )

  async function handleUploadBackgroundPhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    event.preventDefault()

    if (documents?.length >= MAX_OF_FILES) {
      toast({
        title: 'Erro com o arquivo',
        description: `O limite de ${MAX_OF_FILES} arquivos foi atingido.`,
        variant: 'destructive',
      })
      return
    }

    const files = event.target.files
    if (!files || files?.length === 0) {
      return
    }

    const file = files[0]
    const fileSize = file.size / 1024 / 1024
    if (fileSize > 10) {
      toast({
        title: 'Erro com o arquivo',
        description: 'O arquivo deve ter no máximo 10MB.',
        variant: 'destructive',
      })
      return
    }

    if (documents && documents?.some((d) => d.name === file.name)) {
      toast({
        title: 'Erro com o arquivo',
        description: `O arquivo '${file.name}' já foi enviado.`,
        variant: 'destructive',
      })
      return
    }

    alertProgressRef.current?.open()

    const imagePath = `${baseFolderToUpload}/${session.data?.user.id}/${file.name}`

    const storageRef = ref(storage, imagePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    setCurrentUploadTask(uploadTask)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        switch (snapshot.state) {
          case 'running':
            setCurrentProgress(Math.floor(progress))
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

          alertProgressRef.current?.close()
          return
        }

        toast({
          title: 'Erro ao enviar imagem',
          description: 'Tente novamente mais tarde.',
          variant: 'destructive',
        })

        alertProgressRef.current?.close()
      },
      () => {
        getDownloadURL(storageRef)
          .then(async (downloadUrl) => {
            const coll = collection(firestore, firebaseModels.documents)
            const upload = {
              type: file.type,
              name: file.name,
              size: file.size,
              downloadUrl,
              createdAt: Date.now(),
              createdBy: session.data!.user.id,
              updatedAt: Date.now(),
              updatedBy: session.data!.user.id,
              companyOfUser: session.data!.user.companyId,
              status: appConfigs.firebase.models.status.active,
            }

            const doc = await addDoc(coll, upload)

            onChange?.([...documents, { ...upload, id: doc.id }])
          })
          .finally(() => {
            toast({
              title: 'Upload finalizado',
              description: `O arquivo '${file.name}' foi enviado com sucesso.`,
              variant: 'success',
            })
            alertProgressRef.current?.close()
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
            description: 'O upload foi cancelado.',
            variant: 'destructive',
          })

          setCurrentProgress(0)
          setCurrentUploadTask(null)
          alertProgressRef.current?.close()
        }
      }
    }
  }

  function handleViewFile(document: Document) {
    window.open(document.downloadUrl, '_blank', 'noopener,noreferrer')
  }

  function handleDownloadFile(doc: Document) {
    const anchor = document.createElement('a')
    anchor.target = '_blank'
    anchor.href = doc.downloadUrl
    anchor.download = doc.name
    anchor.click()

    toast({
      title: 'Download iniciado',
      description: 'O download do arquivo foi iniciado.',
      variant: 'default',
    })
  }

  async function handleDeleteFile(document: Document) {
    try {
      toast({
        title: `Deletando documento #${document.name}`,
        variant: 'default',
      })

      const coll = collection(firestore, firebaseModels.documents)
      const docRef = doc(coll, document.id)

      await updateDoc(docRef, {
        updatedAt: Date.now(),
        updatedBy: session.data?.user.id ?? '',
        status: appConfigs.firebase.models.status.inactive,
      })

      onChange?.(
        documents.filter(
          (d) => d.id !== document.id || d.name !== document.name,
        ),
      )
      toast({
        title: 'Documento deletado com sucesso!',
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Erro ao deletar documento!',
        variant: 'destructive',
      })
    }
  }

  const text =
    documents?.length > 0 ? `${documents.length} documento(s)` : placeholder

  return (
    <div
      aria-disabled={props.disabled}
      className={cn(
        // 'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed group',
        '',
        className,
      )}
    >
      <label
        htmlFor={fieldId}
        className={cn(
          inputVariants({ variant: 'default' }),
          'read-only:cursor-pointer read-only:!opacity-100 flex items-center text-gray-600 truncate',
          props.disabled &&
            '!cursor-not-allowed !bg-opacity-50 !border-transparent',
        )}
      >
        {text}
        <input
          id={fieldId}
          onChange={handleUploadBackgroundPhoto}
          {...props}
          type="file"
          accept="image/*"
          className="invisible"
        />
      </label>

      {documents &&
        documents?.map((document) => {
          return (
            <div
              key={document.id}
              className={`flex items-center justify-between mt-4 ${isOnModal ? 'text-white' : ''}`}
            >
              <div className="flex items-center gap-2">
                <File className="size-4" />
                <span className="text-sm">
                  {document.name} ({formatFileSize(document?.size)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ScanSearch
                  className="size-4 cursor-pointer"
                  onClick={() => handleViewFile(document)}
                />
                <CloudDownload
                  className="size-4 cursor-pointer"
                  onClick={() => handleDownloadFile(document)}
                />
                {!props.disabled && (
                  <X
                    className={cn(
                      'size-4 cursor-pointer group-aria-disabled:cursor-not-allowed',
                      props.disabled && '!cursor-not-allowed',
                    )}
                    onClick={
                      props.disabled
                        ? undefined
                        : () => handleDeleteFile(document)
                    }
                  />
                )}
              </div>
            </div>
          )
        })}

      <ProgressAlertDialog
        title="Subindo arquivos"
        progress={currentProgress}
        onCancelUpload={handleCancelUpload}
        ref={alertProgressRef}
      />
    </div>
  )
}
