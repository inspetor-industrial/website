import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { units } from '@inspetor/constants/units'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  totalBodyExaminationB: z.string().optional().default(''),
  meanBodyExaminationB: z.string().optional().default(''),
  thicknessProvidedByManufacturerBodyExaminationB: z
    .string()
    .optional()
    .default(''),
  corrosionRateBodyExaminationB: z.string().optional().default(''),
  allowableThicknessBodyExaminationB: z.string().optional().default(''),
  photosBodyExaminationB: documentValidator,
})

type Schema = z.infer<typeof schema>

type FormThirtyThreeProps = {
  defaultValues?: Record<string, any>
}

const FormThirtyThree = forwardRef(function FormThirtyThree(
  { defaultValues }: FormThirtyThreeProps,
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
          ultrasoundTests: {
            ...(defaultValues?.ultrasoundTests ?? {}),
            bodyExaminationB: {
              ...(defaultValues?.ultrasoundTests?.bodyExaminationB ?? {}),
              total: values.totalBodyExaminationB,
              mean: values.meanBodyExaminationB,
              thicknessProvidedByManufacturer:
                values.thicknessProvidedByManufacturerBodyExaminationB,
              corrosionRate: values.corrosionRateBodyExaminationB,
              allowableThickness: values.allowableThicknessBodyExaminationB,
              photos: values.photosBodyExaminationB,
            },
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
          name="totalBodyExaminationB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TOTAL DE MEDIDAS TOMADAS:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meanBodyExaminationB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MÉDIA DETERMINADA:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thicknessProvidedByManufacturerBodyExaminationB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ESPESSURA FORNECIDA PELO FABRICANTE:</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} type="number" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="corrosionRateBodyExaminationB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TAXA DE CORROSÃO:</FormLabel>
              <FormControl>
                <InputWithSuffix
                  {...field}
                  suffix={units.percentage}
                  type="number"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allowableThicknessBodyExaminationB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ESP. MÍN. ADMITIDA PARA A PRESSÃO DE SERV.:</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.mm} type="number" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photosBodyExaminationB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fotos</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-ultrasonic-a-photo"
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

export { FormThirtyThree }
