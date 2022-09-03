import React, { useState, useEffect } from 'react'

export default function Greeting() {
  const [greeting, setGreeting] = useState<string>('')

  let today = new Date()
  let curHr = today.getHours()

  useEffect(() => {
    if (curHr < 12) {
      setGreeting('morning')
    } else if (curHr < 18) {
      setGreeting('afternoon')
    } else {
      setGreeting('evening')
    }
  }, [curHr])

  return (
    <>
      <h1 className='text-4xl font-extrabold mb-4'>
        <span className='font-light'>Good</span>
        {' ' + greeting}
      </h1>
    </>
  )
}
