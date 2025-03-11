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
  const thicknessProvideByCreator = defaultValues?.structure?.body?.thickness
    ? // eslint-disable-next-line no-eval
      (eval(defaultValues?.structure?.body?.thickness) * 25.4).toFixed(2)
    : defaultValues?.thicknessProvidedByManufacturerBodyExaminationB

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(defaultValues ?? {}),
      thicknessProvidedByManufacturerBodyExaminationB:
        thicknessProvideByCreator,
    },
  })

  const determinedAverage = form.watch('meanBodyExaminationB')

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
      'allowableThicknessBodyExaminationB',
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

      form.setValue('corrosionRateBodyExaminationB', String(corrosionRate))
    }
  }, [determinedAverage, form, thicknessProvideByCreator])

  return (
    <Form {...form}>
      <form className="space-y-2.5 max-w-[462px]">
        <FormField
          control={form.control}
          name="totalBodyExaminationB"
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
          name="meanBodyExaminationB"
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
          name="thicknessProvidedByManufacturerBodyExaminationB"
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
          name="corrosionRateBodyExaminationB"
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
          name="allowableThicknessBodyExaminationB"
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
          name="photosBodyExaminationB"
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

export { FormThirtyThree }
