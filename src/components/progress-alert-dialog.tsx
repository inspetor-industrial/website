'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import { Progress } from './ui/progress'

type ProgressAlertDialogProps = {
  title: string
  progress: number

  onCancelUpload?: () => void
}

export type ProgressAlertDialogMethods = {
  open: () => void
  close: () => void
}

const ProgressAlertDialog = forwardRef(function PADC(
  { title, onCancelUpload, progress }: ProgressAlertDialogProps,
  ref,
) {
  const [progressAlertDialogIsOpened, setProgressAlertDialogIsOpened] =
    useState(false)

  function handleOpenProgressAlertDialog() {
    setProgressAlertDialogIsOpened(true)
  }

  function handleCloseProgressAlertDialog() {
    setProgressAlertDialogIsOpened(false)
  }

  useImperativeHandle<unknown, ProgressAlertDialogMethods>(ref, () => {
    return {
      open: handleOpenProgressAlertDialog,
      close: handleCloseProgressAlertDialog,
    }
  })

  return (
    <AlertDialog open={progressAlertDialogIsOpened}>
      <AlertDialogContent className="rounded">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Aguarde enquanto processamos o upload da imagem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="items-center">
          <Progress value={progress} />
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={onCancelUpload}>
            Cancelar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

export { ProgressAlertDialog }
