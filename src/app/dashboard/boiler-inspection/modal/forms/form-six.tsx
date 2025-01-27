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
import { Label } from '@inspetor/components/ui/label'
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
  furnaceType: z.string().optional(),
  heatingSurface: z.string().optional(),
  tubeDiameter: z.string().optional(),
  tubeThickness: z.string().optional(),

  furnaceHeight: z.string().optional(),
  furnaceWidth: z.string().optional(),
  furnaceLength: z.string().optional(),
  furnaceDiameter: z.string().optional(),

  furnaceDimensionsInfos: z.string().optional(),
})

type Schema = z.infer<typeof schema>

type FormSixProps = {
  defaultValues?: Record<string, any>
}

export const furnaceTypeOptions = [
  { value: 'refractory', label: 'Refratária' },
  { value: 'cooled', label: 'Refrigerada' },
  { value: 'waterTube', label: 'Aquatubular' },
]

export const furnaceDimensionsInfosOptions = [
  { value: 'cal', label: 'Comprimento, Altura e Largura' },
  { value: 'da', label: 'Diâmetro e Altura' },
  { value: 'ds', label: 'Diâmetro e Comprimento' },
]

const FormSix = forwardRef(function FormSix(
  { defaultValues }: FormSixProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const furnaceType = form.watch('furnaceType') ?? ''
  const furnaceDimensionsInfos = form.watch('furnaceDimensionsInfos') ?? 'cal'

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...values,
          structure: {
            ...(defaultValues?.structure ?? {}),
            heatingSurface: values.heatingSurface,
            furnace: {
              ...(defaultValues?.structure?.furnace ?? {}),
              type: values.furnaceType,
              infos: values.furnaceDimensionsInfos,
              dimensions: {
                ...(defaultValues?.structure?.furnace?.dimensions ?? {}),
                width: values.furnaceWidth,
                height: values.furnaceHeight,
                length: values.furnaceLength,
                diameter: values.furnaceDiameter,

                tube: {
                  ...(defaultValues?.structure?.furnace?.dimensions?.tube ??
                    {}),
                  diameter: values.tubeDiameter,
                  thickness: values.tubeThickness,
                },
              },
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
          name="heatingSurface"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Superfície de aquecimento</FormLabel>
              <FormControl>
                <InputWithSuffix {...field} suffix={units.m2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="furnaceType"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Tipo da fornalha</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue className="truncate" />
                    </SelectTrigger>

                    <SelectContent className="max-w-[462px]">
                      {furnaceTypeOptions.map((option) => (
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

        {furnaceType === 'refractory' && (
          <div className="">
            <Label variant="form">Dimensões</Label>
            <div className="pl-8 space-y-0.5">
              <FormField
                control={form.control}
                name="furnaceWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Largura</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.mm} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnaceLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprimento</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.mm} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnaceHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.mm} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {furnaceType === 'cooled' && (
          <div>
            <FormField
              name="furnaceDimensionsInfos"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="mb-2">
                    <FormLabel>Informações a serem preenchidas</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? 'cal'}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue className="truncate" />
                        </SelectTrigger>

                        <SelectContent className="max-w-[462px]">
                          {furnaceDimensionsInfosOptions.map((option) => (
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

            <Label variant="form">Dimensões</Label>
            {furnaceDimensionsInfos === 'cal' && (
              <div className="pl-8 space-y-0.5">
                <FormField
                  control={form.control}
                  name="furnaceWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Largura</FormLabel>
                      <FormControl>
                        <InputWithSuffix {...field} suffix={units.mm} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="furnaceLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comprimento</FormLabel>
                      <FormControl>
                        <InputWithSuffix {...field} suffix={units.mm} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="furnaceHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura</FormLabel>
                      <FormControl>
                        <InputWithSuffix {...field} suffix={units.mm} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {furnaceDimensionsInfos === 'da' && (
              <div className="pl-8 space-y-0.5">
                <FormField
                  control={form.control}
                  name="furnaceDiameter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diâmetro</FormLabel>
                      <FormControl>
                        <InputWithSuffix {...field} suffix={units.mm} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="furnaceHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura</FormLabel>
                      <FormControl>
                        <InputWithSuffix {...field} suffix={units.mm} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {furnaceDimensionsInfos === 'ds' && (
              <div className="pl-8 space-y-0.5">
                <FormField
                  control={form.control}
                  name="furnaceDiameter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diâmetro</FormLabel>
                      <FormControl>
                        <InputWithSuffix {...field} suffix={units.mm} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="furnaceLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comprimento</FormLabel>
                      <FormControl>
                        <InputWithSuffix {...field} suffix={units.mm} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

        {furnaceType === 'waterTube' && (
          <div>
            <FormField
              control={form.control}
              name="tubeDiameter"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>Diâmetro do tubo da fornalha</FormLabel>
                  <FormControl>
                    <InputWithSuffix {...field} suffix={units.pol} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tubeThickness"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>Espessura do tubo da fornalha</FormLabel>
                  <FormControl>
                    <InputWithSuffix {...field} suffix={units.mm} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label variant="form">Dimensões</Label>
            <div className="pl-8 space-y-0.5">
              <FormField
                control={form.control}
                name="furnaceWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Largura</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.mm} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnaceLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprimento</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.mm} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnaceHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.mm} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </form>
    </Form>
  )
})

export { FormSix }
