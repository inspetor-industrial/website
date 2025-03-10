import { NrCheckbox } from './nr-checkbox'

interface Nr {
  parent: string
  parentSelected: boolean
  children: {
    selected: boolean
    text: string
  }[]
}

interface NrOptionProps {
  nr: Nr
  onSelectValue: (nr: Nr) => void
}

export function NrOption({ nr, onSelectValue }: NrOptionProps) {
  const doesAllCheckboxSelected =
    (nr.children.every((n) => n.selected) && nr.children.length > 0) ||
    nr.parentSelected

  return (
    <div>
      <div>
        <NrCheckbox
          value={doesAllCheckboxSelected}
          label={nr.parent}
          onChangeValue={(value) => {
            nr.parentSelected = value
            nr.children = nr.children.map((n) => {
              n.selected = value
              return n
            })

            onSelectValue(nr)
          }}
          labelClassName="normal-case"
        />
      </div>
      <div className="pl-6 mt-1 space-y-0.5">
        {nr.children.map((child) => {
          return (
            <NrCheckbox
              key={JSON.stringify(child)}
              value={child.selected}
              label={child.text}
              onChangeValue={(value) => {
                if (!value) {
                  nr.parentSelected = false
                }

                for (let i = 0; i < nr.children.length; i++) {
                  if (nr.children[i].text === child.text) {
                    nr.children[i].selected = value
                  }
                }

                onSelectValue(nr)
              }}
              labelClassName="normal-case"
            />
          )
        })}
      </div>
    </div>
  )
}
