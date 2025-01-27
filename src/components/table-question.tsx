import { Checkbox } from './ui/checkbox'

type Option = {
  question: string
  answer: string
}

type TableQuestionProps = {
  options: Option[]
  onChange?: (value: Option[]) => void
  extraLogicOnChange?: (value: Option[], currentOption: Option) => Option[]
}

export function TableQuestion({
  options,
  onChange,
  extraLogicOnChange,
}: TableQuestionProps) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-5 w-full border border-b-0 border-black h-full divide-x divide-black last:border-b">
        <div className="col-span-3"></div>
        <div className="flex items-center justify-center">
          <span className="text-white font-bold">Sim</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-white font-bold">Não</span>
        </div>
      </div>
      {options.map((option) => {
        return (
          <div
            key={option.question}
            className="grid grid-cols-5 w-full border border-b-0 border-black h-full divide-x divide-black last:border-b"
          >
            <div className="col-span-3">
              <p className="text-white text-xs px-3 py-2">{option.question}</p>
            </div>
            <div className="flex items-center justify-center">
              <Checkbox
                checked={option.answer === 'yes'}
                className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                onCheckedChange={() => {
                  const answers = options.map((o) => {
                    if (o.question === option.question) {
                      return { ...o, answer: 'yes' }
                    }

                    return o
                  })

                  onChange?.(
                    extraLogicOnChange
                      ? extraLogicOnChange(answers, {
                          ...option,
                          answer: 'yes',
                        })
                      : answers,
                  )
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <Checkbox
                checked={option.answer === 'no'}
                className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                onCheckedChange={() => {
                  const answers = options.map((o) => {
                    if (o.question === option.question) {
                      return { ...o, answer: 'no' }
                    }

                    return o
                  })

                  onChange?.(
                    extraLogicOnChange
                      ? extraLogicOnChange(answers, {
                          ...option,
                          answer: 'no',
                        })
                      : answers,
                  )
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
