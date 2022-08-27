import React from 'react'
import { DropdownEntry } from 'src/types/ui'
import { HiChevronDown } from 'react-icons/hi'

export default function Dropdown({
  id,
  entries,
  label,
  initialOption,
  handleChange,
}: {
  id: string
  entries: DropdownEntry[]
  label?: string
  initialOption?: DropdownEntry
  handleChange: React.ChangeEventHandler
}) {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <div className='relative rounded-full w-full bg-gray-100 text-neutral-500 border border-gray-200 focus:outline-2 outline-lime-400'>
        <select
          onChange={(e) => handleChange(e)}
          className='appearance-none px-4 relative py-2 rounded-full w-full bg-gray-100 text-neutral-500 border border-gray-200 focus:outline-2 outline-lime-400'
          id={id}
        >
          {initialOption ? (
            <option value={initialOption.value}>{initialOption.name}</option>
          ) : (
            <option value=''>Please select...</option>
          )}
          {entries.map((entry: DropdownEntry) => (
            <option key={entry.value} value={entry.value}>
              {entry.name}
            </option>
          ))}
        </select>
        <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
          <HiChevronDown />
        </div>
      </div>
    </>
  )
}
