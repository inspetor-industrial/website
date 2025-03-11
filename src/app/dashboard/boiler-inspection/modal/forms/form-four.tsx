import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inspetor/components/ui/select'
import { units } from '@inspetor/constants/units'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  capacity: z.string().optional(),
  type: z.string().optional(),
  yearOfManufacture: z.string().optional(),
  mark: z.string().optional(),
})

type Schema = z.infer<typeof schema>

type FormFourProps = {
  defaultValues?: Record<string, any>
}

export const typeOptions = [
  { value: 'fireTubeHorizontal', label: 'Fogotubular Horizontal' },
  { value: 'fireTubeVertical', label: 'Fogotubular Vertical' },
  { value: 'waterTubeHorizontal', label: 'Aquatubular Horizontal' },
  { value: 'waterTubeVertical', label: 'Aquatubular Vertical' },
  { value: 'mixed', label: 'Mista' },
]

const FormFour = forwardRef(function FormFour(
  { defaultValues }: FormFourProps,
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
          identification: {
            ...(defaultValues?.identification ?? {}),
            type: values.type,
            manufacturer: values.manufacturer,
            model: values.model,
            yearOfManufacture: values.yearOfManufacture,
            mark: values.mark,
            capacity: values.capacity,
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
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Fabricante</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="mark"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">Marca</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Tipo</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue className="truncate" />
                  </SelectTrigger>

                  <SelectContent className="max-w-[462px]">
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="yearOfManufacture"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">
                  Ano de fabricação
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          name="model"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">Modelo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          name="capacity"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">Capacidade</FormLabel>
                <FormControl>
                  <InputWithSuffix {...field} suffix={units.kgfPerCm2} />
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

export { FormFour }
