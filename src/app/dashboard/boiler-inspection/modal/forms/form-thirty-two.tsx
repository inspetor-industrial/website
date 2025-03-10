import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import { Checkbox } from '@inspetor/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { Label } from '@inspetor/components/ui/label'
import { units } from '@inspetor/constants/units'
import { valueToCalculateAutomaticBoilerBody } from '@inspetor/utils/value-to-calculate-automatic-boiler-body'
import { valueToCalculateAutomaticBoilerUsedBody } from '@inspetor/utils/value-to-calculate-automatic-boiler-used-body'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  isRegularizedAccordingToASME1: z.string().optional().default(''),
  totalBodyExaminationA: z.string().optional().default(''),
  meanBodyExaminationA: z.string().optional().default(''),
  thicknessProvidedByManufacturerBodyExaminationA: z
    .string()
    .optional()
    .default(''),
  corrosionRateBodyExaminationA: z.string().optional().default(''),
  allowableThicknessBodyExaminationA: z.string().optional().default(''),
  photosBodyExaminationA: documentValidator,
})

type Schema = z.infer<typeof schema>

type FormThirtyTwoProps = {
  defaultValues?: Record<string, any>
}

const FormThirtyTwo = forwardRef(function FormThirtyTwo(
  { defaultValues }: FormThirtyTwoProps,
  ref,
) {
  const thicknessProvideByCreator = defaultValues?.structure?.body?.thickness
    ? // eslint-disable-next-line no-eval
      (eval(defaultValues?.structure?.body?.thickness) * 25.4).toFixed(2)
    : defaultValues?.thicknessProvidedByManufacturerBodyExaminationA

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(defaultValues ?? {}),
      thicknessProvidedByManufacturerBodyExaminationA:
        thicknessProvideByCreator,
    },
  })

  const determinedAverage = form.watch('meanBodyExaminationA')

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...values,
          ultrasoundTests: {
            ...(defaultValues?.ultrasoundTests ?? {}),
            bodyExaminationA: {
              ...(defaultValues?.ultrasoundTests?.bodyExaminationA ?? {}),
              isRegularizedAccordingToASME1:
                values.isRegularizedAccordingToASME1,
              total: values.totalBodyExaminationA,
              mean: values.meanBodyExaminationA,
              thicknessProvidedByManufacturer:
                values.thicknessProvidedByManufacturerBodyExaminationA,
              corrosionRate: values.corrosionRateBodyExaminationA,
              allowableThickness: values.allowableThicknessBodyExaminationA,
              photos: values.photosBodyExaminationA,
            },
          },
        }
      },
      form,
    }
  })

  useEffect(() => {
    const bodyDiameter = defaultValues?.structure?.body?.thickness || '0'
    const bodyThickness = defaultValues?.structure?.body?.thickness || '0'
    const boilerMaximumPressure =
      defaultValues?.identification?.maximumWorkingPressure || '0'
    const furnaceType = defaultValues?.structure?.furnace?.type || ''
    const aquatubularTubeDiameter =
      defaultValues?.structure?.furnace?.dimensions?.diameter || '0'
    const tubeDiameter =
      defaultValues?.structure?.furnace?.dimensions?.tube?.diameter || '0'

    const isRegularizedAccordingToASME1 = form.getValues(
      'isRegularizedAccordingToASME1',
    )

    if (isRegularizedAccordingToASME1) {
      const result = valueToCalculateAutomaticBoilerBody({
        values: 0,
        body_diameter: bodyDiameter,
        tube_diameter: tubeDiameter,
        boiler_maximum_pressure: boilerMaximumPressure,
        aquatubular_tube_diameter: aquatubularTubeDiameter,
        furnace_types: furnaceType,
      })

      form.setValue(
        'allowableThicknessBodyExaminationA',
        String(result?.toFixed(2)),
      )
    } else {
      const result = valueToCalculateAutomaticBoilerUsedBody({
        values: 0,
        body_diameter: bodyDiameter,
        body_thickness: bodyThickness,
        boiler_maximum_pressure: boilerMaximumPressure,
        determinedAverage,
        furnaceType: furnaceType,
        aquatubular_tube_diameter: aquatubularTubeDiameter,
      })
      form.setValue(
        'allowableThicknessBodyExaminationA',
        String(result?.toFixed(2)),
      )
    }
  }, [
    defaultValues?.identification?.maximumWorkingPressure,
    defaultValues?.structure?.body?.thickness,
    defaultValues?.structure?.furnace?.dimensions?.diameter,
    defaultValues?.structure?.furnace?.dimensions?.tube?.diameter,
    defaultValues?.structure?.furnace?.type,
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

      form.setValue('corrosionRateBodyExaminationA', String(corrosionRate))
    }
  }, [determinedAverage, form, thicknessProvideByCreator])

  return (
    <Form {...form}>
      <form className="space-y-2.5 max-w-[462px]">
        <FormField
          control={form.control}
          name="isRegularizedAccordingToASME1"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Regularizado conforme ASME I?</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <div className="space-x-1 flex items-center">
                    <Checkbox
                      checked={field.value === 'yes'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'yes' : '')
                      }}
                      className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                      id="option-yes"
                    />
                    <Label
                      htmlFor="option-yes"
                      variant="form"
                      className="text-sm"
                    >
                      SIM
                    </Label>
                  </div>
                  <div className="space-x-1 flex items-center">
                    <Checkbox
                      checked={field.value === 'no'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'no' : '')
                      }}
                      className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                      id="option-no"
                    />
                    <Label
                      htmlFor="option-no"
                      variant="form"
                      className="text-sm"
                    >
                      NÃO
                    </Label>
                  </div>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalBodyExaminationA"
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
          name="meanBodyExaminationA"
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
          name="thicknessProvidedByManufacturerBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ESPESSURA FORNECIDA PELO FABRICANTE:</FormLabel>
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
          name="corrosionRateBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TAXA DE CORROSÃO:</FormLabel>
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
          name="allowableThicknessBodyExaminationA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ESP. MÍN. ADMITIDA PARA A PRESSÃO DE SERV.:</FormLabel>
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
          name="photosBodyExaminationA"
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

export { FormThirtyTwo }
