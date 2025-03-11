import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import { NrSelect } from '@inspetor/components/nr-select'
import { TableQuestion } from '@inspetor/components/table-question'
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
import { Separator } from '@inspetor/components/ui/separator'
import { Textarea } from '@inspetor/components/ui/textarea'
import { nrsForMeasurementContinuationValve } from '@inspetor/constants/nrs'
import { units } from '@inspetor/constants/units'
import { documentValidator } from '@inspetor/utils/zod-validations/document-validator'
import { nrValidator } from '@inspetor/utils/zod-validations/nr-validator'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  quantityOfValves: z.string(),
  valve1: z.object({
    calibrationOrderNumber: z.string().optional().default(''),
    diameter: z.string().optional().default(''),
    flow: z.string().optional().default(''),
    tests: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),

    nrs: nrValidator,

    openingPressure: z.string().optional().default(''),
    closingPressure: z.string().optional().default(''),
  }),
  valve2: z.object({
    calibrationOrderNumber: z.string().optional().default(''),
    diameter: z.string().optional().default(''),
    flow: z.string().optional().default(''),
    tests: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),

    nrs: nrValidator,

    openingPressure: z.string().optional().default(''),
    closingPressure: z.string().optional().default(''),
  }),
  valve3: z.object({
    calibrationOrderNumber: z.string().optional().default(''),
    diameter: z.string().optional().default(''),
    flow: z.string().optional().default(''),
    tests: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),

    nrs: nrValidator,

    openingPressure: z.string().optional().default(''),
    closingPressure: z.string().optional().default(''),
  }),
  valvePhotos: documentValidator,
  isThereSafetyValveRedundancy: z.string().optional().default(''),
  observationsValves: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

export const securityMeasurementContinuationValve3 = [
  { question: 'FUNCIONAM NORMALMENTE?', answer: '' },
  {
    question: 'FORAM DESMONTADAS?',
    answer: '',
  },
  { question: 'FOI OBSERVADA ALGUMA ANOMALIA?', answer: '' },
  { question: 'FORAM CONSERTADAS?', answer: '' },
  { question: 'FORAM SUBSTITUÍDAS?', answer: '' },
  { question: 'FORAM REGULADAS?', answer: '' },
]

type FormTwentySixProps = {
  defaultValues?: Record<string, any>
}

const FormTwentySix = forwardRef(function FormTwentySix(
  { defaultValues }: FormTwentySixProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const quantityOfValves = Number(form.watch('quantityOfValves') ?? '0')

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        return {
          ...values,
          safetyValveGauge: {
            ...(defaultValues?.safetyValveGauge ?? {}),
            quantity: values.quantityOfValves,
            valves: [values.valve1, values.valve2, values.valve3],
            isThereSafetyValveRedundancy: values.isThereSafetyValveRedundancy,
            observations: values.observationsValves,
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
          name="quantityOfValves"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-zinc-50">
                Selecione a quantidade de válvula:
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(quantity) => {
                    field.onChange(quantity)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Válvula 1</SelectItem>
                    <SelectItem value="2">Válvula 1 e 2</SelectItem>
                    <SelectItem value="3">Válvula 1, 2 e 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {quantityOfValves >= 1 && (
          <div className="space-y-2.5">
            <span className="text-white text-lg mt-2">Válvula 1</span>

            <FormField
              control={form.control}
              name="valve1.calibrationOrderNumber"
              render={({ field }) => (
                <FormItem className="mt-0">
                  <FormLabel className="text-zinc-50">
                    N° de ordem de calibração:
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="valve1.diameter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-50">Diâmetro:</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.pol} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valve1.flow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-50">Vazão:</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.kgvPerH} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="valve1.nrs"
              render={({ field }) => (
                <FormItem className="flex justify-end">
                  <FormControl>
                    <NrSelect
                      onSelectNr={(nrs) => {
                        field.onChange(nrs)
                      }}
                      nrs={field.value ?? nrsForMeasurementContinuationValve}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valve1.tests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TableQuestion
                      options={
                        field.value || securityMeasurementContinuationValve3
                      }
                      onChange={field.onChange}
                      // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {quantityOfValves >= 2 && <Separator />}

        {quantityOfValves >= 2 && (
          <div className="space-y-2.5">
            <span className="text-white text-lg mt-2">Válvula 2</span>

            <FormField
              control={form.control}
              name="valve2.calibrationOrderNumber"
              render={({ field }) => (
                <FormItem className="mt-0">
                  <FormLabel className="text-zinc-50">
                    N° de ordem de calibração:
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="valve2.diameter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-50">Diâmetro:</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.pol} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valve2.flow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-50">Vazão:</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.kgvPerH} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="valve2.nrs"
              render={({ field }) => (
                <FormItem className="flex justify-end">
                  <FormControl>
                    <NrSelect
                      onSelectNr={(nrs) => {
                        field.onChange(nrs)
                      }}
                      nrs={field.value ?? nrsForMeasurementContinuationValve}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valve2.tests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TableQuestion
                      options={
                        field.value || securityMeasurementContinuationValve3
                      }
                      onChange={field.onChange}
                      // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {quantityOfValves >= 3 && <Separator />}

        {quantityOfValves === 3 && (
          <div className="space-y-2.5">
            <span className="text-white text-lg mt-2">Válvula 3</span>

            <FormField
              control={form.control}
              name="valve3.calibrationOrderNumber"
              render={({ field }) => (
                <FormItem className="mt-0">
                  <FormLabel className="text-zinc-50">
                    N° de ordem de calibração:
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="valve3.diameter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-50">Diâmetro:</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.pol} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valve3.flow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-50">Vazão:</FormLabel>
                    <FormControl>
                      <InputWithSuffix {...field} suffix={units.kgvPerH} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="valve3.nrs"
              render={({ field }) => (
                <FormItem className="flex justify-end">
                  <FormControl>
                    <NrSelect
                      onSelectNr={(nrs) => {
                        field.onChange(nrs)
                      }}
                      nrs={field.value ?? nrsForMeasurementContinuationValve}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valve3.tests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TableQuestion
                      options={
                        field.value || securityMeasurementContinuationValve3
                      }
                      onChange={field.onChange}
                      // extraLogicOnChange={handleTableExamsApplyNrsLogic}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="valvePhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Fotos:</FormLabel>
              <FormControl>
                <DocumentField
                  isOnModal
                  baseFolderToUpload="boiler-inspection-valves-photo"
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
          name="isThereSafetyValveRedundancy"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-50">
                  Existe redundância de válvula de segurança?
                </FormLabel>
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
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="observationsValves"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Observações:</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormTwentySix }
