import { NrOption } from './nr-option'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'

interface Nr {
  parent: string
  parentSelected: boolean
  children: {
    selected: boolean
    text: string
  }[]
}

interface NrSelectProps {
  nrs?: Nr[]
  onSelectNr: (nrs: Nr[]) => void
}

export function NrSelect({ nrs, onSelectNr }: NrSelectProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-6 w-20 p-0 bg-white hover:bg-white/90 text-insp-blue font-bold"
          type="button"
        >
          NR&apos;s
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[470px] bg-inspetor-dark-blue-700 border-0 ring-0"
        onInteractOutside={() => {}}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-white font-semibold">
          <DialogTitle>NR&apos;s</DialogTitle>
          <DialogDescription className="text-white">
            Selecione as nrs que não estão sendo satisfeita:
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="space-y-3 max-h-[400px] hover:bg-transparent pb-10">
          {nrs?.map((nr, indexOfNr) => {
            return (
              <NrOption
                onSelectValue={(nrToSave) => {
                  nrs[indexOfNr] = nrToSave
                  onSelectNr(nrs)
                }}
                nr={nr}
                key={JSON.stringify(nr)}
              />
            )
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
