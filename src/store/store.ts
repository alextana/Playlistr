import { atom } from 'jotai'

// playlist track
export const trackAtom = atom<string | null>(null)

// search state
export const searchAtom = atom<boolean>(false)
export const searchResultAtom = atom<any>([])
export const searchTermsAtom = atom<string>('')

export const attributionAtom = atom<string>('')
