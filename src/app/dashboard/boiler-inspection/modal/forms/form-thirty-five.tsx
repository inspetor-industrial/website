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
import { valueToCalculateAutomaticBoilerBody } from '@inspetor/utils/value-to-calculate-automatic-boiler-body'
import { valueToCalculateAutomaticFurnace } from '@inspetor/utils/value-to-calculate-automatic-furnace'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
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
  let thicknessProvideByCreator = '0'
  if (defaultValues?.structure?.furnace?.type === 'waterTube') {
    thicknessProvideByCreator = defaultValues?.structure?.body?.furnace
      ?.dimensions?.tube?.thickness
      ? // eslint-disable-next-line no-eval
        (
          eval(defaultValues?.structure?.furnace?.dimensions?.tube?.thickness) *
          25.4
        ).toFixed(2)
      : defaultValues?.thicknessProvidedByManufacturerBodyExaminationD
  } else {
    thicknessProvideByCreator = defaultValues?.structure?.body?.furnace
      ?.dimensions?.tube?.thickness
      ? // eslint-disable-next-line no-eval
        (eval(defaultValues?.structure?.mirror?.thickness) * 25.4).toFixed(2)
      : defaultValues?.thicknessProvidedByManufacturerBodyExaminationD
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(defaultValues ?? {}),
      thicknessProvidedByManufacturerBodyExaminationD:
        thicknessProvideByCreator,
    },
  })

  const determinedAverage = form.watch('meanBodyExaminationD')

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

  useEffect(() => {
    const bodyDiameter = defaultValues?.structure?.body?.thickness || '0'
    const boilerMaximumPressure =
      defaultValues?.identification?.maximumWorkingPressure || '0'
    const furnaceType = defaultValues?.structure?.furnace?.type || ''
    const aquatubularTubeDiameter =
      defaultValues?.structure?.furnace?.dimensions?.diameter || '0'
    const tubeDiameter =
      defaultValues?.structure?.furnace?.dimensions?.tube?.diameter || '0'
    const furnaceTypeInfo = defaultValues?.structure?.furnace?.infos || ''
    const staysWidth =
      defaultValues?.structure?.freeLengthWithoutStaysOrTube || '0'

    if (defaultValues?.structure?.furnace?.type === 'waterTube') {
      const result = valueToCalculateAutomaticBoilerBody({
        boiler_maximum_pressure: boilerMaximumPressure,
        bodyDiameter,
        body_diameter: bodyDiameter,
        tube_diameter: tubeDiameter,
        values: 0,
        furnace_types: furnaceType,
        aquatubular_tube_diameter: aquatubularTubeDiameter,
        isFurnaceForm: true,
      })

      form.setValue(
        'allowableThicknessBodyExaminationD',
        String(result?.toFixed(2)),
      )
    } else if (defaultValues?.structure?.furnace?.type === 'cooled') {
      const result = valueToCalculateAutomaticFurnace({
        bodyDiameter: bodyDiameter,
        tube_diameter: tubeDiameter,
        aquatubular_tube_diameter: aquatubularTubeDiameter,
        boiler_maximum_pressure: boilerMaximumPressure,
        values: 0,
        furnaceTypeInfo,
        staysWidth,
      })

      form.setValue(
        'allowableThicknessBodyExaminationD',
        String(result?.toFixed(2)),
      )
    } else {
      form.setValue('allowableThicknessBodyExaminationD', String(0))
    }
  }, [
    defaultValues?.identification?.maximumWorkingPressure,
    defaultValues?.structure?.body?.thickness,
    defaultValues?.structure?.freeLengthWithoutStaysOrTube,
    defaultValues?.structure?.furnace?.dimensions?.diameter,
    defaultValues?.structure?.furnace?.dimensions?.tube?.diameter,
    defaultValues?.structure?.furnace?.infos,
    defaultValues?.structure?.furnace?.type,
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

      form.setValue('corrosionRateBodyExaminationD', String(corrosionRate))
    }
  }, [determinedAverage, form, thicknessProvideByCreator])

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
