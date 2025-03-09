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
  totalBodyExaminationD: z.string().optional().default(''),
  meanBodyExaminationD: z.string().optional().default(''),
  thicknessProvidedByManufacturerBodyExaminationD: z
    .string()
    .optional()
    .default(''),
  corrosionRateBodyExaminationD: z.string().optional().default(''),
  allowableThicknessBodyExaminationD: z.string().optional().default(''),
  photosBodyExaminationD: documentValidator,
})

type Schema = z.infer<typeof schema>

type FormThirtyFiveProps = {
  defaultValues?: Record<string, any>
}

const FormThirtyFive = forwardRef(function FormThirtyFive(
  { defaultValues }: FormThirtyFiveProps,
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
            bodyExaminationD: {
              ...(defaultValues?.ultrasoundTests?.bodyExaminationD ?? {}),
              total: values.totalBodyExaminationD,
              mean: values.meanBodyExaminationD,
              thicknessProvidedByManufacturer:
                values.thicknessProvidedByManufacturerBodyExaminationD,
              corrosionRate: values.corrosionRateBodyExaminationD,
              allowableThickness: values.allowableThicknessBodyExaminationD,
              photos: values.photosBodyExaminationD,
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
          name="totalBodyExaminationD"
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
          name="meanBodyExaminationD"
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
          name="thicknessProvidedByManufacturerBodyExaminationD"
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
          name="corrosionRateBodyExaminationD"
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
          name="allowableThicknessBodyExaminationD"
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
          name="photosBodyExaminationD"
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

export { FormThirtyFive }
