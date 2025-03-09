'use client'

import '@inspetor/polyfills/string'

import { Button } from '@inspetor/components/ui/button'
import { Input } from '@inspetor/components/ui/input'
import { toast } from '@inspetor/hooks/use-toast'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

type FormStepperProps = {
  currentStep: number
  gotoStep: (step: number) => void
  totalSteps: number
}

export function FormStepper({
  currentStep,
  gotoStep,
  totalSteps,
}: FormStepperProps) {
  const [step, setStep] = useState(Math.max(1, currentStep))
  function handleGotoStep(step: number) {
    if (step < 1 || step > totalSteps) {
      toast({
        title: 'Atenção ao informar o número do passo',
        description: `Por favor, informe um número entre 1 e ${totalSteps}.`,
        variant: 'destructive',
      })

      return
    }

    gotoStep(step)
  }

  return (
    <div className="flex items-center w-full justify-start gap-2">
      <Input
        className="h-8 w-20 !text-xs pl-2"
        value={step}
        onChange={(event) =>
          setStep((event.target.value || '').replace(/\D/g, '').toNumber() || 0)
        }
      />
      <Button
        size="icon"
        variant="icon"
        className="bg-white size-8 hover:bg-opacity-85 hover:bg-white"
        onClick={() => handleGotoStep(step)}
      >
        <ArrowRight className="!size-3" />
      </Button>
    </div>
  )
}
