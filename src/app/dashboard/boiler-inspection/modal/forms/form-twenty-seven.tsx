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
import { nrsForElectricalControlMeasurement } from '@inspetor/constants/nrs'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  gaugeTests: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
  gaugeNrs: nrValidator,
  gaugePhotos: documentValidator,
  observationsGauge: z.string().optional().default(''),
})

export const eletricalControlMeasurements = [
  {
    question: 'HÁ PAINEL DE COMANDO PARA CONTROLE AUTOMÁTICO DA CALDEIRA?',
    answer: '',
  },
  { question: 'FUNCIONA NORMALMENTE?', answer: '' },
  { question: 'HÁ PEÇAS DE REPOSIÇÃO?', answer: '' },
  {
    question: 'HÁ REDUNDÂNCIA NOS SISTEMAS DE SEGURANÇA DO PAINEL?',
    answer: '',
  },
  { question: 'HÁ ALGUM OUTRO DISPOSITIVO DE ELETRÔNICO?', answer: '' },
]

type Schema = z.infer<typeof schema>

type FormTwentySevenProps = {
  defaultValues?: Record<string, any>
}

const FormTwentySeven = forwardRef(function FormTwentySeven(
  { defaultValues }: FormTwentySevenProps,
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
          gaugeOfElectricOrElectronicControlDevicesAndCommands: {
            ...(defaultValues?.gaugeOfElectricOrElectronicControlDevicesAndCommands ??
              {}),
            tests: {
              questions: values.gaugeTests,
              nrsToAdd: values.gaugeNrs,
            },
            photos: values.gaugePhotos,
            observations: values.observationsGauge,
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
          name="gaugeNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForElectricalControlMeasurement}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gaugeTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || eletricalControlMeasurements}
                  onChange={field.onChange}
                  // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observationsGauge"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-zinc-50">Observações:</FormLabel>
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
          name="gaugePhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Fotos:</FormLabel>
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

export { FormTwentySeven }
