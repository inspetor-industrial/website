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

    window.addEventListener(events.contact.sending, handleInitSubmitting)
    window.addEventListener(events.contact.sent, handleFinishSubmitting)

    return () => {
      window.removeEventListener(events.contact.sending, handleInitSubmitting)
      window.removeEventListener(events.contact.sent, handleFinishSubmitting)
    }
  }, [])

  return (
    <Button
      disabled={isSubmitting}
      variant="inspetor-gray"
      className="self-end px-10"
      form="contact-form"
    >
      {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Enviar'}
    </Button>
  )
}
