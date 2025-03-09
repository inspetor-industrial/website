'use client'

import { PartialBoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { Button } from '@inspetor/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@inspetor/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@inspetor/components/ui/scroll-area'
import { events } from '@inspetor/constants/events'
import { toast } from '@inspetor/hooks/use-toast'
import { blankFunction } from '@inspetor/utils/blank-function'
import { makeOptionValue } from '@inspetor/utils/combobox-options'
import { parseBoilerReportInspection } from '@inspetor/utils/parse-boiler-report-inspection'
import { merge } from 'lodash'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { FormStepper } from './form-stepper'
import { forms } from './forms'
import { FormRef } from './forms/form'

type BoilerInspectionModalProps = {}

export type BoilerInspectionModalRef = {
  open: () => void
  close: () => void
}

const BoilerInspectionModal = forwardRef(function BoilerInspectionModal(
  props: BoilerInspectionModalProps,
  ref,
) {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [currentFormIndex, setCurrentFormIndex] = useState(0)

  const [boilerReportState, setBoilerReportState] =
    useState<PartialBoilerInspection>({})

  function getBoilerReportToDefaultValuesInForm() {
    let boilerReport = { ...boilerReportState }
    boilerReport = parseBoilerReportInspection(boilerReport)

    // @ts-expect-error [ignore]
    boilerReport = {
      ...boilerReport,
      ...(boilerReport.identification || {}),
    }

    return boilerReport
  }

  function updateReportInfo(values: PartialBoilerInspection) {
    setBoilerReportState((prev) => {
      return merge(prev, values)
    })
  }

  function clearBoilerReport() {
    setBoilerReportState({})
  }

  const formRef = useRef<FormRef | null>(null)

  const { Form, formTitle } = useMemo(() => {
    return forms[currentFormIndex]
  }, [currentFormIndex])

  async function handleCancelOrComeback() {
    if (currentFormIndex === 0) {
      setIsModalOpened(false)
      return
    }

    setCurrentFormIndex((prevIndex) => prevIndex - 1)
  }

  async function handleSubmitStep() {
    if (!formRef.current) {
      toast({
        title: 'Erro',
        description: 'Formulário não encontrado',
        variant: 'destructive',
      })

      return
    }

    const submit = formRef.current.form.handleSubmit(blankFunction)
    await submit()

    const isFormValid =
      Object.keys(formRef.current.form.formState.errors).length === 0

    if (!isFormValid) {
      console.log(
        'formRef.current.form.formState',
        formRef.current.form.formState.errors,
      )
      toast({
        title: 'Erro',
        description:
          'Verifique os campos necessários, pois alguns estão inválidos',
        variant: 'destructive',
      })

      return
    }

    const valuesToUpdate = formRef.current
      .runAutoCompleteAndFormatterWithDefaultValues
      ? formRef.current.runAutoCompleteAndFormatterWithDefaultValues(
          formRef.current.getValues(),
        )
      : formRef.current.getValues()
    updateReportInfo(valuesToUpdate)

    if (currentFormIndex === forms.length - 1) {
      setIsModalOpened(false)
      toast({
        title: 'Sucesso',
        description: 'Relatório de inspeção de caldeira salvo com sucesso',
        variant: 'success',
      })

      return
    }

    setCurrentFormIndex((prevIndex) => prevIndex + 1)
  }

  useEffect(() => {
    function handleOpenModalByEvent() {
      setIsModalOpened(true)
    }

    window.addEventListener(
      events.models.boilerInspection.navigate.to.register,
      handleOpenModalByEvent,
    )

    return () => {
      window.removeEventListener(
        events.models.boilerInspection.navigate.to.register,
        handleOpenModalByEvent,
      )
    }
  }, [])

  useImperativeHandle(ref, () => {
    return {
      open: () => setIsModalOpened(true),
      close: () => setIsModalOpened(false),
    }
  })

  return (
    <Dialog
      open={isModalOpened}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearBoilerReport()
          setCurrentFormIndex(0)
        }

        setIsModalOpened(isOpen)
      }}
      {...props}
    >
      <DialogContent
        className="bg-inspetor-dark-blue-700 border-inspetor-dark-blue-700"
        onPointerDownOutside={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onInteractOutside={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white">{formTitle}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96 min-h-96 w-full">
          <Form
            ref={formRef}
            defaultValues={getBoilerReportToDefaultValuesInForm()}
          />

          <ScrollBar />
        </ScrollArea>

        <DialogFooter className="justify-between w-full flex items-center">
          <FormStepper
            currentStep={currentFormIndex + 1}
            totalSteps={forms.length}
            gotoStep={(step: number) => {
              setCurrentFormIndex(Math.max(step - 1, 0))
            }}
          />
          <div className="flex items-center gap-4">
            <Button
              variant="modal"
              size="modal"
              onClick={handleCancelOrComeback}
            >
              {currentFormIndex === 0 ? 'Cancelar' : 'Voltar'}
            </Button>

            <Button variant="modal" size="modal" onClick={handleSubmitStep}>
              {currentFormIndex === forms.length - 1 ? 'Finalizar' : 'Próximo'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

export { BoilerInspectionModal }
