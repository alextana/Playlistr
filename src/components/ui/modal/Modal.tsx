import React from 'react'
import { animated, useSpring } from 'react-spring'
import { HiX } from 'react-icons/hi'

export default function Modal({
  open,
  children,
  handleClose,
  modalTitle,
}: {
  open: boolean
  children: React.ReactNode
  handleClose: React.MouseEventHandler
  modalTitle?: string
}) {
  const modalStyles = useSpring({
    opacity: open ? 1 : 0,
    y: open ? '-50%' : '0%',
    x: open ? '-50%' : '-50%',
  })

  const overlayStyles = useSpring({
    opacity: open ? 1 : 0,
  })
  return (
    <>
      {open && (
        <>
          <animated.div
            style={modalStyles}
            className='px-6 py-3 bg-white w-5/6 lg:w-1/2 z-50 transform rounded-3xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          >
            <div
              onClick={handleClose}
              className='absolute right-3 cursor-pointer hover:text-gray-800 top-3 close-button'
            >
              <HiX className='h-6 w-6 text-gray-600 hover:text-gray-800' />
            </div>
            {modalTitle && (
              <div className='modal-title'>
                <h2 className='text-2xl text-gray-500 tracking-tight font-light mb-4'>
                  {modalTitle}
                </h2>
              </div>
            )}
            {children}
          </animated.div>
          <animated.div
            onClick={handleClose}
            style={overlayStyles}
            className='fixed z-40 top-0 left-0 w-screen h-screen bg-black/40 backdrop-blur-md'
          ></animated.div>
        </>
      )}
    </>
  )
}
