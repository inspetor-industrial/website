'use client'

import {
  clearBoilerReportAtom,
  getBoilerReportToDefaultValuesInFormAtom,
  updateBoilerReportAtom,
} from '@inspetor/atoms/boiler-report'
import { Button } from '@inspetor/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@inspetor/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@inspetor/components/ui/scroll-area'
import { events } from '@inspetor/constants/events'
import { toast } from '@inspetor/hooks/use-toast'
import { blankFunction } from '@inspetor/utils/blank-function'
import { useSetAtom } from 'jotai'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

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

  const getBoilerReportToDefaultValuesInForm = useSetAtom(
    getBoilerReportToDefaultValuesInFormAtom,
  )
  const updateReportInfo = useSetAtom(updateBoilerReportAtom)
  const clearBoilerReport = useSetAtom(clearBoilerReportAtom)

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
        formRef.current.form.formState.dirtyFields,
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
        </DialogHeader>

        <ScrollArea className="h-96 min-h-96 w-full">
          <Form
            ref={formRef}
            defaultValues={getBoilerReportToDefaultValuesInForm()}
          />

          <ScrollBar />
        </ScrollArea>

        <DialogFooter>
          <Button variant="modal" size="modal" onClick={handleCancelOrComeback}>
            {currentFormIndex === 0 ? 'Cancelar' : 'Voltar'}
          </Button>

          <Button variant="modal" size="modal" onClick={handleSubmitStep}>
            Próximo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

export { BoilerInspectionModal }
