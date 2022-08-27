import React, { ReactElement, useEffect, useState } from 'react'

export default function Button({
  children,
  type,
  onClick,
}: {
  children: string | ReactElement
  type?: string
  onClick?: any
}) {
  const [classesToUse, setClassesToUse] = useState('')

  useEffect(() => {
    switch (type) {
      case 'primary':
        setClassesToUse('bg-green-500 hover:bg-green-600')
        break
      case 'secondary':
        setClassesToUse('bg-gray-500 hover:bg-gray-600')
        break
      case '':
        setClassesToUse('bg-yellow-500 hover:bg-yellow-600')
        break
    }
  }, [type])

  return (
    <button
      onClick={onClick}
      className={`${classesToUse} px-4 py-2 rounded-lg`}
    >
      {children}
    </button>
  )
}
