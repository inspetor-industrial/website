import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inspetor/components/ui/select'
import { units } from '@inspetor/constants/units'
import { calculateHydrostaticTestPressure } from '@inspetor/utils/calculate-hydrostatic-test-pressure'
import { convertKgfToLbf } from '@inspetor/utils/convert-kgh-to-lbf'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  fuel: z.string().optional(),
  maximumWorkingPressure: z.string().optional(),
  operatingPressure: z.string().optional(),
  series: z.string().optional(),
  category: z.string().optional(),
})

type Schema = z.infer<typeof schema>

type FormFiveProps = {
  defaultValues?: Record<string, any>
}

export const fuelOptions = [
  { value: 'firewood', label: 'Lenha' },
  { value: 'woodChips', label: 'Cavaco' },
  { value: 'bagasse', label: 'Bagaço' },
  { value: 'straw', label: 'Palha' },
  { value: 'lpg', label: 'GLP' },
  { value: 'ng', label: 'GN' },
  { value: 'dieselOil', label: 'Óleo diesel' },
  { value: 'bpfOil', label: 'Óleo BPF' },
  { value: 'blackLiquor', label: 'Licor negro' },
  { value: 'briquette', label: 'Briquete' },
]

const FormFive = forwardRef(function FormFive(
  { defaultValues }: FormFiveProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const maximumPressureWorking = form.watch('maximumWorkingPressure') || '0'
  const operationPressure = form.watch('operatingPressure') || '0'

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...values,
          identification: {
            ...(defaultValues?.identification ?? {}),
            fuel: values.fuel,
            maximumWorkingPressure: values.maximumWorkingPressure,
            operatingPressure: values.operatingPressure,
            series: values.series,
            category: values.category,
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
          name="maximumWorkingPressure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pressão máxima de trabalho admissível</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <InputWithSuffix {...field} suffix={units.kgfPerCm2} />
                  <InputWithSuffix
                    value={convertKgfToLbf(eval(maximumPressureWorking || '0'))}
                    suffix={units.lbfPerIn2}
                    disabled
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="fuel"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Combustível</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue className="truncate" />
                    </SelectTrigger>

                    <SelectContent className="max-w-[462px]">
                      {fuelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="operatingPressure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pressão de operação</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <InputWithSuffix {...field} suffix={units.kgfPerCm2} />
                  <InputWithSuffix
                    value={convertKgfToLbf(eval(operationPressure || '0'))}
                    suffix={units.lbfPerIn2}
                    disabled
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-0.5">
          <Label variant="form">Pressão teste hidrostático</Label>
          <div className="flex space-x-2">
            <InputWithSuffix
              value={calculateHydrostaticTestPressure(
                eval(maximumPressureWorking || '0'),
              )}
              suffix={units.kgfPerCm2}
              disabled
            />
            <InputWithSuffix
              value={convertKgfToLbf(
                eval(
                  calculateHydrostaticTestPressure(
                    eval(maximumPressureWorking || '0'),
                  ),
                ),
              )}
              suffix={units.lbfPerIn2}
              disabled
            />
          </div>
        </div>

        <FormField
          name="series"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Série</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          name="category"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Categoria da caldeira</FormLabel>
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
                        A
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
                        B
                      </Label>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </form>
    </Form>
  )
})

export { FormFive }
