import React, { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useAtom } from 'jotai'
import { attributionAtom } from 'src/store/store'
import Head from 'next/head'
import Footer from '../ui/layout/Footer'
import Header from '../ui/layout/Header'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function LoginScreen() {
  const [random, setRandom] = useState<number>(1)
  const [, setAttribution] = useAtom(attributionAtom)
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    setShow(true)
  }, [show])

  useEffect(() => {
    setRandom(Math.floor(Math.random() * 5))

    switch (random) {
      case 0:
        setAttribution(
          `Photo by <a href="https://unsplash.com/@jamakassi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jamakassi</a> on <a href="https://unsplash.com/s/photos/music-listen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`
        )
        break
      case 1:
        setAttribution(
          `Photo by <a href="https://unsplash.com/@benblenner?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ben Blennerhassett</a> on <a href="https://unsplash.com/s/photos/listening-to-musc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`
        )
        break
      case 2:
        setAttribution(
          `Photo by <a href="https://unsplash.com/@alicemoore?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Elice Moore</a> on <a href="https://unsplash.com/@alicemoore?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`
        )
        break
      case 3:
        setAttribution(
          `Photo by <a href="https://unsplash.com/@schluditsch?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Daniel Schludi</a> on <a href="https://unsplash.com/s/photos/listening-to-music?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`
        )
        break
      case 4:
        setAttribution(
          `Photo by <a href="https://unsplash.com/@introspectivedsgn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Erik Mclean</a> on <a href="https://unsplash.com/s/photos/listening-to-music?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`
        )
        break
    }
  }, [random, setAttribution])

  return (
    <div ref={parent}>
      <Head>
        <title>Welcome to playlistr</title>
      </Head>
      <div className='login-container w-screen h-screen grid place-content-center'>
        <Header isFixed={true} />
        <div className='z-10 spotify-login grid grid-cols-1 items-end lg:grid-cols-2 shadow-2xl'>
          <div className='left-side text-center bg-neutral-800/80 backdrop-blur-lg py-8 xl:py-12 px-6'>
            <h1 className='text-6xl xl:text-8xl font-extrabold tracking-tighter mb-2'>
              Hello
            </h1>
            <h3 className='text-sm font-bold'>
              A Spotify Premium account is required
            </h3>

            <div className='spotify-login-button w-max mx-auto mt-4'>
              <button
                onClick={() => signIn('spotify')}
                className='flex gap-3 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full font-bold text-black'
                role='link'
              >
                <div className='spotify-icon'>
                  <svg
                    width='24'
                    height='24'
                    xmlns='http://www.w3.org/2000/svg'
                    fillRule='evenodd'
                    clipRule='evenodd'
                  >
                    <path d='M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z' />
                  </svg>
                </div>
                <h4>Signin with Spotify</h4>
              </button>
            </div>
          </div>
          <div className='right-side text-center lg:text-left py-6 lg:py-12 px-6 bg-green-600/80 backdrop-blur-lg rounded-br-3xl lg:rounded-tr-3xl'>
            <h3 className='text-4xl lg:text-7xl font-extrabold'>Easily</h3>
            <h3 className='text-3xl lg:text-6xl font-extrabold tracking-tighter'>
              Create &
            </h3>
            <h3 className='text-3xl lg:text-6xl font-extrabold tracking-tighter mb-2'>
              Manage
            </h3>
            <h3 className='font-extrabold tracking-tighter text-2xl'>
              your Spotify playlists
            </h3>
          </div>
        </div>
        <Footer isFixed={true} />
      </div>
      {show && (
        <div
          className={`bg-${random} fixed z-10 top-0 left-0 w-screen h-screen`}
          style={{ zIndex: '0' }}
        >
          <div
            className='overlay-login fixed top-0 left-0 w-screen h-screen gradient-bg'
            style={{ zIndex: 1 }}
          ></div>
        </div>
      )}
    </div>
  )
}
