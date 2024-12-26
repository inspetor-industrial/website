'use client'

import { isLoadingProfileAtom } from '@inspetor/atoms/profile'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@inspetor/components/ui/dialog'
import { useAtomValue } from 'jotai'
import { Loader2 } from 'lucide-react'

export function LoadingDialog() {
  const isLoadingProfile = useAtomValue(isLoadingProfileAtom)

  return (
    <Dialog open={isLoadingProfile}>
      <DialogContent onFocusOutside={() => {}} showCloseButton={false}>
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>

        <div className="flex flex-col items-center gap-4">
          <span className="text-3xl font-semibold">Inspetor Industrial</span>
          <span className="text-center">
            Estamos buscando as informações do seu perfil, por favor aguarde...
          </span>
          <Loader2 className="animate-spin size-6" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
