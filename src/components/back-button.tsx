'use client'

import { useRouter } from 'next/navigation'
import { useProgress } from 'react-transition-progress'

import { Button } from './ui/button'

export function BackButton() {
  const startProgressBar = useProgress()
  const router = useRouter()

  function handleGoBack() {
    startProgressBar()
    router.back()
  }

  return (
    <Button variant="secondary" onClick={handleGoBack}>
      Voltar
    </Button>
  )
}
