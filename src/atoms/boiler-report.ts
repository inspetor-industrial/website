import { PartialBoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { makeOptionValue } from '@inspetor/utils/combobox-options'
import { atom } from 'jotai'
import { cloneDeep, merge } from 'lodash'

export const boilerReportAtom = atom<PartialBoilerInspection>({})

export const updateBoilerReportAtom = atom(
  null,
  (get, set, updatedInfo: PartialBoilerInspection) => {
    const boilerReport = get(boilerReportAtom)
    set(boilerReportAtom, merge(boilerReport, updatedInfo))
  },
)

export const getBoilerReportToDefaultValuesInFormAtom = atom(null, (get) => {
  const boilerReport = cloneDeep(get(boilerReportAtom))

  if (boilerReport.client) {
    // @ts-expect-error [ignore]
    boilerReport.client = makeOptionValue(boilerReport.client)
  }

  return boilerReport
})

export const clearBoilerReportAtom = atom(null, (_, set) => {
  set(boilerReportAtom, {})
})
