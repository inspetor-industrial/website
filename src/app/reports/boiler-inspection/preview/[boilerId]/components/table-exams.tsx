import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@inspetor/components/ui/table'
import { ComponentProps } from 'react'

interface TableExamsProps extends ComponentProps<'table'> {
  exams?: {
    question: string
    answer: string
  }[]
  questions: string[]
}

export function TableExams({ exams, children, questions }: TableExamsProps) {
  return (
    <Table className="border-2">
      <TableHeader>
        <TableRow>
          <TableHead className="border-2 text-slate-900 text-lg"></TableHead>
          <TableHead className="border-2 text-slate-900 text-lg text-center">
            SIM
          </TableHead>
          <TableHead className="border-2 text-slate-900 text-lg text-center">
            NÃO
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions?.map((question) => {
          return (
            <TableRow key={`${question}`}>
              <TableCell className="border-2 text-slate-900 py-1">
                {question}
              </TableCell>
              <TableCell className="border-2 text-slate-900 py-1 text-center">
                {exams?.find((e) => e.question === question)?.answer ===
                  'yes' && 'X'}
              </TableCell>
              <TableCell className="border-2 text-slate-900 py-1 text-center">
                {exams?.find((e) => e.question === question)?.answer === 'no' &&
                  'X'}
              </TableCell>
            </TableRow>
          )
        })}
        {children}
      </TableBody>
    </Table>
  )
}
