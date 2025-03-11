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
import { valueToCalculateAutomaticMirror } from '@inspetor/utils/value-to-calculate-automatic-mirror'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  totalBodyExaminationC: z.string().optional().default(''),
  meanBodyExaminationC: z.string().optional().default(''),
  thicknessProvidedByManufacturerBodyExaminationC: z
    .string()
    .optional()
    .default(''),
  corrosionRateBodyExaminationC: z.string().optional().default(''),
  allowableThicknessBodyExaminationC: z.string().optional().default(''),
  photosBodyExaminationC: documentValidator,
})

type Schema = z.infer<typeof schema>

type FormThirtyFourProps = {
  defaultValues?: Record<string, any>
}

const FormThirtyFour = forwardRef(function FormThirtyFour(
  { defaultValues }: FormThirtyFourProps,
  ref,
) {
  const thicknessProvideByCreator = defaultValues?.structure?.body?.thickness
    ? // eslint-disable-next-line no-eval
      (eval(defaultValues?.structure?.body?.thickness) * 25.4).toFixed(2)
    : defaultValues?.thicknessProvidedByManufacturerBodyExaminationC

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(defaultValues ?? {}),
      thicknessProvidedByManufacturerBodyExaminationC:
        thicknessProvideByCreator,
    },
  })

  const determinedAverage = form.watch('meanBodyExaminationC')

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...values,
          ultrasoundTests: {
            ...(defaultValues?.ultrasoundTests ?? {}),
            bodyExaminationC: {
              ...(defaultValues?.ultrasoundTests?.bodyExaminationC ?? {}),
              total: values.totalBodyExaminationC,
              mean: values.meanBodyExaminationC,
              thicknessProvidedByManufacturer:
                values.thicknessProvidedByManufacturerBodyExaminationC,
              corrosionRate: values.corrosionRateBodyExaminationC,
              allowableThickness: values.allowableThicknessBodyExaminationC,
              photos: values.photosBodyExaminationC,
            },
          },
        }
      },
      form,
    }
  })

  useEffect(() => {
    const boilerMaximumPressure =
      defaultValues?.identification?.maximumWorkingPressure || '0'
    const alwaysLength =
      defaultValues?.structure?.freeLengthWithoutStaysOrTube || '0'

    const result = valueToCalculateAutomaticMirror({
      value: 0,
      always_length: alwaysLength,
      boiler_maximum_pressure: boilerMaximumPressure,
    })

    form.setValue(
      'allowableThicknessBodyExaminationC',
      String(result?.toFixed(2)),
    )
  }, [
    defaultValues?.identification?.maximumWorkingPressure,
    defaultValues?.structure?.freeLengthWithoutStaysOrTube,
    determinedAverage,
    form,
  ])

  useEffect(() => {
    if (determinedAverage && thicknessProvideByCreator) {
      const corrosionRate =
        determinedAverage && thicknessProvideByCreator
          ? Number(determinedAverage.replaceAll(',', '.')) >
            Number(thicknessProvideByCreator.replaceAll(',', '.'))
            ? 0
            : (
                (Number(determinedAverage) /
                  Number(thicknessProvideByCreator)) *
                  -100 +
                100
              ).toFixed(2)
          : ''

      form.setValue('corrosionRateBodyExaminationC', String(corrosionRate))
    }
  }, [determinedAverage, form, thicknessProvideByCreator])

  return (
    <Form {...form}>
      <form className="space-y-2.5 max-w-[462px]">
        <FormField
          control={form.control}
          name="totalBodyExaminationC"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                TOTAL DE MEDIDAS TOMADAS:
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meanBodyExaminationC"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">MÉDIA DETERMINADA:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thicknessProvidedByManufacturerBodyExaminationC"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                ESPESSURA FORNECIDA PELO FABRICANTE:
              </FormLabel>
              <FormControl>
                <InputWithSuffix
                  {...field}
                  suffix={units.mm}
                  type="number"
                  readOnly
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="corrosionRateBodyExaminationC"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">TAXA DE CORROSÃO:</FormLabel>
              <FormControl>
                <InputWithSuffix
                  {...field}
                  suffix={units.percentage}
                  type="number"
                  readOnly
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allowableThicknessBodyExaminationC"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                ESP. MÍN. ADMITIDA PARA A PRESSÃO DE SERV.:
              </FormLabel>
              <FormControl>
                <InputWithSuffix
                  {...field}
                  suffix={units.mm}
                  type="number"
                  readOnly
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photosBodyExaminationC"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Fotos</FormLabel>
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

export { FormThirtyFour }
