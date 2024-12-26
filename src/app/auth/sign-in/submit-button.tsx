'use client'

import { Button } from '@inspetor/components/ui/button'
import { events } from '@inspetor/constants/events'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SubmitButton() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    function handleInitSubmitting() {
      setIsSubmitting(true)
    }

    function handleFinishSubmitting() {
      setIsSubmitting(false)
    }

    window.addEventListener(events.auth.loginInProgress, handleInitSubmitting)
    window.addEventListener(events.auth.loginFinished, handleFinishSubmitting)

    return () => {
      window.removeEventListener(
        events.auth.loginInProgress,
        handleInitSubmitting,
      )
      window.removeEventListener(
        events.auth.loginFinished,
        handleFinishSubmitting,
      )
    }
  }, [])

  return (
    <Button
      disabled={isSubmitting}
      variant="inspetor-gray"
      className="self-end px-10"
      form="sign-in"
    >
      {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Entrar'}
    </Button>
  )
}
