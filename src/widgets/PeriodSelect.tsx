/* eslint-disable no-restricted-exports */
'use client'

import { ReactSelect } from '@payloadcms/ui'
import React from 'react'

import './PeriodSelect.scss'

export const PERIOD_OPTIONS = [
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 90 days', value: '90days' },
] as const

export const periodLabel = (period: string): string =>
  PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? PERIOD_OPTIONS[0].label

/**
 * Inline period selector rendered directly on a dashboard widget, so viewers
 * can change the time range without entering dashboard edit mode. Uses
 * Payload's ReactSelect for visual parity with other admin widgets.
 */
export function PeriodSelect({
  onChange,
  value,
}: {
  onChange: (value: string) => void
  value: string
}) {
  const options = PERIOD_OPTIONS.map((option) => ({ label: option.label, value: option.value }))
  const selected = options.find((option) => option.value === value) ?? options[0]

  return (
    <div className="analytics-period-select">
      <ReactSelect
        isClearable={false}
        isSearchable={false}
        onChange={(value) => {
          const opt = Array.isArray(value) ? value[0] : value
          if (opt) {
            onChange(String(opt.value))
          }
        }}
        options={options}
        value={selected}
      />
    </div>
  )
}
