'use client'

import { PartialBoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { ButtonLoading } from '@inspetor/components/button-loading'
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
import { boilerInspectionType } from '@inspetor/constants/boiler-inspection-type'
import { appConfigs } from '@inspetor/constants/configs'
import { events } from '@inspetor/constants/events'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { firestore } from '@inspetor/lib/firebase/client'
import { blankFunction } from '@inspetor/utils/blank-function'
import {
  makeOptionObject,
  makeOptionValue,
} from '@inspetor/utils/combobox-options'
import { generateSubstrings } from '@inspetor/utils/generate-substrings'
import { parseBoilerReportInspection } from '@inspetor/utils/parse-boiler-report-inspection'
import { replaceUndefinedValues } from '@inspetor/utils/replace-undefined-values'
import { runSafety } from '@inspetor/utils/run-safety'
import { useQueryClient } from '@tanstack/react-query'
import {
  collection,
  doc,
  getCountFromServer,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { merge } from 'lodash'
import { useSession } from 'next-auth/react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
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

type BoilerInspectionModalProps = {
  isInToolbar?: boolean
}

export type BoilerInspectionModalRef = {
  open: () => void
  close: () => void
}

const BoilerInspectionModal = forwardRef(function BoilerInspectionModal(
  { isInToolbar = false, ...props }: BoilerInspectionModalProps,
  ref,
) {
  const [search] = useQueryState('search', parseAsString.withDefault(''))
  const [currentPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const queryClient = useQueryClient()

  const [isModalOpened, setIsModalOpened] = useState(false)
  const [currentFormIndex, setCurrentFormIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const session = useSession()

  const [boilerReportState, setBoilerReportState] =
    useState<PartialBoilerInspection>({})

  const [boilerReportId, setBoilerReportId] = useState<string | null>(null)

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
    setBoilerReportId(null)
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
    try {
      if (session.data?.user?.companyId === 'unknown') {
        toast({
          title: 'AVISO!',
          description:
            'Usuário sem empresa associada. Contate os administradores associar uma empresa e ajustar o usuário criado, caso contrário não será possível realizar qualquer ação no sistema.',
          variant: 'destructive',
        })

        return
      }

      setIsSubmitting(true)
      if (!formRef.current) {
        toast({
          title: 'Erro',
          description: 'Formulário não encontrado',
          variant: 'destructive',
        })

        setIsSubmitting(false)
        return
      }

      const submit = formRef.current.form.handleSubmit(blankFunction)
      await submit()

      const isFormValid =
        Object.keys(formRef.current.form.formState.errors).length === 0

      if (!isFormValid) {
        toast({
          title: 'Erro',
          description:
            'Verifique os campos necessários, pois alguns estão inválidos',
          variant: 'destructive',
        })

        setIsSubmitting(false)
        return
      }

      const valuesToUpdate = formRef.current
        .runAutoCompleteAndFormatterWithDefaultValues
        ? formRef.current.runAutoCompleteAndFormatterWithDefaultValues(
            formRef.current.getValues(),
          )
        : formRef.current.getValues()

      if (valuesToUpdate.startTimeInspection) {
        valuesToUpdate.startTimeInspection = await runSafety(
          () => {
            return valuesToUpdate.startTimeInspection.format('HH:mm')
          },
          () => {
            return valuesToUpdate.startTimeInspection
          },
        )
      }

      if (valuesToUpdate.endTimeInspection) {
        valuesToUpdate.endTimeInspection = await runSafety(
          () => {
            return valuesToUpdate.endTimeInspection.format('HH:mm')
          },
          () => {
            return valuesToUpdate.endTimeInspection
          },
        )
      }

      if (typeof valuesToUpdate.client === 'string') {
        valuesToUpdate.client = makeOptionObject(valuesToUpdate.client, [
          'id',
          'name',
          'cnpjOrCpf',
        ])
      }

      if (typeof valuesToUpdate.responsible === 'string') {
        valuesToUpdate.responsible = makeOptionObject(
          valuesToUpdate.responsible,
          ['id', 'name', 'stateRegistry'],
        )
      }

      updateReportInfo(valuesToUpdate)

      await runSafety(async () => {
        let docId = boilerReportId
        const coll = collection(firestore, firebaseModels.boilerInspection)

        const substrings = generateSubstrings(
          `${valuesToUpdate.client?.name}${boilerInspectionType[valuesToUpdate.service as keyof typeof boilerInspectionType]}`,
        )

        if (!docId) {
          const newDoc = doc(coll)
          docId = newDoc.id

          const total = await getCountFromServer(query(coll))

          await setDoc(newDoc, {
            createdAt: Timestamp.now().toMillis(),
            updatedAt: Timestamp.now().toMillis(),
            [appConfigs.firestore.searchProperty]: Array.from(substrings),
            rowNumber: total.data().count + 1,
            createdBy: session.data?.user?.id ?? appConfigs.defaultUsername,
            updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
            [appConfigs.firestore.permissions.byCompanyPropertyName]:
              session.data?.user?.companyId,
          })

          setBoilerReportId(docId)
        }

        await setDoc(
          doc(coll, docId),
          {
            ...replaceUndefinedValues(boilerReportState),
            updatedAt: Timestamp.now().toMillis(),
            [appConfigs.firestore.searchProperty]: Array.from(substrings),
            updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
            [appConfigs.firestore.permissions.byCompanyPropertyName]:
              session.data?.user?.companyId,
          },
          {
            merge: true,
          },
        )
      })

      if (currentFormIndex === forms.length - 1) {
        setIsModalOpened(false)
        toast({
          title: 'Sucesso',
          description: 'Relatório de inspeção de caldeira salvo com sucesso',
          variant: 'success',
        })

        setIsSubmitting(false)
        queryClient.invalidateQueries({
          queryKey: ['boiler-inspection', search, currentPage],
        })
        return
      }

      setCurrentFormIndex((prevIndex) => prevIndex + 1)
    } finally {
      queryClient.invalidateQueries({
        queryKey: ['boiler-inspection', search, currentPage],
      })
      setIsSubmitting(false)
    }
  }

  // useEffect(() => {
  //   function handleOpenModalByEvent() {
  //     setIsModalOpened(true)
  //   }

  //   window.addEventListener(
  //     events.models.boilerInspection.navigate.to.register,
  //     handleOpenModalByEvent,
  //   )

  //   return () => {
  //     window.removeEventListener(
  //       events.models.boilerInspection.navigate.to.register,
  //       handleOpenModalByEvent,
  //     )
  //   }
  // }, [])

  useEffect(() => {
    function handleOpenModalByEvent(event: Event) {
      const { boilerInspectionId, boiler } = (event as CustomEvent).detail

      setBoilerReportId(boilerInspectionId)
      setBoilerReportState({
        ...boiler,
        client:
          typeof boiler.client === 'object'
            ? makeOptionValue(boiler.client, ['id', 'name', 'cnpjOrCpf'])
            : boiler.client,
        responsible:
          typeof boiler.responsible === 'object'
            ? makeOptionValue(boiler.responsible, [
                'id',
                'name',
                'stateRegistry',
              ])
            : boiler.responsible,
      })

      setIsModalOpened(true)
    }

    let eventName = events.models.boilerInspection.navigate.to.update
    if (isInToolbar) {
      eventName = events.models.boilerInspection.navigate.to.updateByToolbar
    }

    window.addEventListener(eventName, handleOpenModalByEvent)

    return () => {
      window.removeEventListener(eventName, handleOpenModalByEvent)
    }
  }, [isInToolbar])

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
          setIsModalOpened(isOpen)
        }
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

            <ButtonLoading
              variant="modal"
              size="modal"
              isLoading={isSubmitting}
              onClick={handleSubmitStep}
            >
              {currentFormIndex === forms.length - 1 ? 'Finalizar' : 'Próximo'}
            </ButtonLoading>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

export { BoilerInspectionModal }
