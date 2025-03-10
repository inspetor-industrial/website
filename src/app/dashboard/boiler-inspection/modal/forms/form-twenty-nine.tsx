import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
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
import { nrsForWaterQuality } from '@inspetor/constants/nrs'
import { units } from '@inspetor/constants/units'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const waterQuality = [
  {
    question: 'Há tratamento de água?',
    answer: '',
  },
  { question: 'O tratamento está sendo feito corretamente?', answer: '' },
  {
    question: 'Há sinal de calcificação em partes ou peças?',
    answer: '',
  },
]

const schema = z.object({
  waterTests: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
  waterNrs: nrValidator,
  observationsWater: z.string().optional().default(''),
  ph: z.string().optional().default(''),
  waterPhotos: documentValidator,
})

type Schema = z.infer<typeof schema>

type FormTwentyNineProps = {
  defaultValues?: Record<string, any>
}

const FormTwentyNine = forwardRef(function FormTwentyNine(
  { defaultValues }: FormTwentyNineProps,
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
          waterQuality: {
            ...(defaultValues?.waterQuality ?? {}),
            tests: {
              questions: values.waterTests,
              nrsToAdd: values.waterNrs,
            },
            ph: values.ph,
            photos: values.waterPhotos,
            observations: values.observationsWater,
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
          name="waterNrs"
          render={({ field }) => (
            <FormItem className="flex justify-end">
              <FormControl>
                <NrSelect
                  onSelectNr={(nrs) => {
                    field.onChange(nrs)
                  }}
                  nrs={field.value ?? nrsForWaterQuality}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waterTests"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TableQuestion
                  options={field.value || waterQuality}
                  onChange={field.onChange}
                  // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ph"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>PH da água:</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.ph} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waterPhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fotos:</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-water-photo"
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

        <FormField
          control={form.control}
          name="observationsWater"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Observações:</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full h-20 p-2 border border-gray-300 rounded-md"
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

export { FormTwentyNine }
