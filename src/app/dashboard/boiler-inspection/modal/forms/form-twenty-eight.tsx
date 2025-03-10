import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Textarea } from '@inspetor/components/ui/textarea'
import { nrsForDischargeSystemMeasurements } from '@inspetor/constants/nrs'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  dischargeTests: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
  dischargesNrs: nrValidator,
  dischargePhotos: documentValidator,
  observationDischarge: z.string().optional().default(''),
})

export const dischargeSystemMeasurements = [
  {
    question: 'HÁ SISTEMA DE DESCARGA DE FUNDO?',
    answer: '',
  },
  { question: 'HÁ NÚMERO SUFICIENTE DE DESCARGAS?', answer: '' },
  { question: 'FUNCIONA(M) NORMALMENTE?', answer: '' },
  {
    question: 'A(S) DESCARGA(S) É(SÃ0) AUTOMÁTICA(S)?',
    answer: '',
  },
  {
    question: 'AS DESCARGAS ESTÃO SENDO FEITAS NO TEMPO CORRETO?',
    answer: '',
  },
]

type Schema = z.infer<typeof schema>

type FormTwentyEightProps = {
  defaultValues?: Record<string, any>
}

const FormTwentyEight = forwardRef(function FormTwentyEight(
  { defaultValues }: FormTwentyEightProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...values,
          bottomDischargeSystemChecks: {
            ...(defaultValues?.bottomDischargeSystemChecks ?? {}),
            tests: {
              questions: values.dischargeTests,
              nrsToAdd: values.dischargesNrs,
            },
            photos: values.dischargePhotos,
            observations: values.observationDischarge,
          },
        }
      },
      form,
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-2.5 max-w-[462px]">
        <FormField
          control={form.control}
          name="dischargesNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForDischargeSystemMeasurements}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dischargeTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || dischargeSystemMeasurements}
                  onChange={field.onChange}
                  // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observationDischarge"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Observações:</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full h-20 p-2 border border-gray-300 rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dischargePhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fotos:</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-ele-photo"
                  accept="image/*"
                  placeholder="Selecione um documento"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormTwentyEight }
