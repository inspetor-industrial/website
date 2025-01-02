import { TableTests as TableTestType } from '@inspetor/@types/models/manometer'
import { units } from '@inspetor/constants/units'
import { sanitizeNumber } from '@inspetor/utils/sanitize-number'
import { Plus, Trash2 } from 'lucide-react'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import { Button } from './ui/button'

export type TableTestsRef = {
  reset: () => void
}

type TableTestsProps = {
  value?: TableTestType[]
  onChange: (value: TableTestType[]) => void
  disabled?: boolean
  isLoading?: boolean
}

const TableTests = forwardRef(function TableTests(
  {
    onChange,
    value = [
      {
        rowId: crypto.randomUUID(),
        standardValue: '',
        cycleOneAscending: '',
        cycleOneDescending: '',
        cycleTwoAscending: '',
        cycleTwoDescending: '',
      },
    ],
    disabled,
  }: TableTestsProps,
  ref,
) {
  const [tests, setTests] = useState<TableTestType[]>(value)

  function handleChangeTableTest({
    index,
    field,
    newValue,
  }: {
    index: number
    field: keyof TableTestType
    newValue: string
  }) {
    value[index][field] = sanitizeNumber(newValue)
    onChange(value)
  }

  const handleReset = useCallback(() => {
    setTests(value)
  }, [value])

  useImperativeHandle(ref, () => ({
    reset: handleReset,
  }))

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col border border-black rounded">
        <div className="bg-inspetor-green-700 text-white font-semibold flex h-fit uppercase">
          <div className="flex items-center justify-center w-56 border-r border-black">
            <span>Valor Padrão</span>
          </div>
          <div className="flex text-center flex-col w-full h-full">
            <div className="border-b border-black h-full flex items-center justify-center py-1">
              <span>Valor de medição em teste</span>
            </div>
            <div className="flex items-center divide-x divide-black h-full">
              <div className="w-full h-full flex items-center justify-center py-1">
                <span>Ciclo 1</span>
              </div>
              <div className="w-full h-full flex items-center justify-center py-1">
                <span>Ciclo 2</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex bg-inspetor-gray-800 text-white font-semibold uppercase border-t border-black">
          <div className="w-56 border-r border-black flex items-center justify-center py-1">
            <span>({units.kgfPerCm2})</span>
          </div>
          <div className="flex text-center w-full divide-x divide-black">
            <div className="w-full flex items-center justify-center py-1">
              <span>Ascendente</span>
            </div>
            <div className="w-full flex items-center justify-center py-1">
              <span>Descedente</span>
            </div>
            <div className="w-full flex items-center justify-center py-1">
              <span>Ascendente</span>
            </div>
            <div className="w-full flex items-center justify-center py-1">
              <span>Descedente</span>
            </div>
          </div>
        </div>

        {tests.map((tableTest, index) => {
          return (
            <div
              key={tableTest.rowId}
              className="group flex bg-white text-zinc-950 font-semibold uppercase border-t border-black h-8 last:rounded-b relative"
            >
              <div
                className="w-56 text-center border-r border-black flex items-center justify-center py-1 h-full focus:outline-none focus:bg-zinc-200"
                contentEditable={!disabled}
                suppressContentEditableWarning
                onInput={(ev) => {
                  handleChangeTableTest({
                    index,
                    field: 'standardValue',
                    newValue: ev.currentTarget.textContent ?? '',
                  })
                }}
              >
                {tableTest.standardValue}
              </div>
              <div className="flex text-center w-full divide-x divide-black h-full">
                <div
                  className="w-full flex items-center justify-center py-1 h-full focus:outline-none focus:bg-zinc-200"
                  contentEditable={!disabled}
                  suppressContentEditableWarning
                  onInput={(ev) => {
                    handleChangeTableTest({
                      index,
                      field: 'cycleOneAscending',
                      newValue: ev.currentTarget.textContent ?? '',
                    })
                  }}
                >
                  {tableTest.cycleOneAscending}
                </div>
                <div
                  className="w-full flex items-center justify-center py-1 h-full focus:outline-none focus:bg-zinc-200"
                  contentEditable={!disabled}
                  suppressContentEditableWarning
                  onInput={(ev) => {
                    handleChangeTableTest({
                      index,
                      field: 'cycleOneDescending',
                      newValue: ev.currentTarget.textContent ?? '',
                    })
                  }}
                >
                  {tableTest.cycleOneDescending}
                </div>
                <div
                  className="w-full flex items-center justify-center py-1 h-full focus:outline-none focus:bg-zinc-200"
                  contentEditable={!disabled}
                  suppressContentEditableWarning
                  onInput={(ev) => {
                    handleChangeTableTest({
                      index,
                      field: 'cycleTwoAscending',
                      newValue: ev.currentTarget.textContent ?? '',
                    })
                  }}
                >
                  {tableTest.cycleTwoAscending}
                </div>
                <div
                  className="w-full flex items-center justify-center py-1 h-full focus:outline-none focus:bg-zinc-200"
                  contentEditable={!disabled}
                  suppressContentEditableWarning
                  onInput={(ev) => {
                    handleChangeTableTest({
                      index,
                      field: 'cycleTwoDescending',
                      newValue: ev.currentTarget.textContent ?? '',
                    })
                  }}
                >
                  {tableTest.cycleTwoDescending}
                </div>
              </div>

              {!disabled && (
                <Button
                  type="button"
                  variant="icon"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex"
                  onClick={() => {
                    const newTestsState = value.filter(
                      (v) => v.rowId !== tableTest.rowId,
                    )

                    onChange(newTestsState)
                    setTests(newTestsState)
                  }}
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {!disabled && (
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => {
            const newTestState = [
              ...value,
              {
                rowId: crypto.randomUUID(),
                standardValue: '',
                cycleOneAscending: '',
                cycleOneDescending: '',
                cycleTwoAscending: '',
                cycleTwoDescending: '',
              },
            ]

            onChange(newTestState)
            setTests(newTestState)
          }}
        >
          <Plus className="size-4" />
        </Button>
      )}
    </div>
  )
})

export { TableTests }
