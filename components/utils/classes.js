const BASE_COLOUR = 'bg-neutral-900/40'
const HOVER_COLOUR = 'hover:bg-indigo-700'
const BASE_TEXT = 'text-white'
const HOVER_TEXT = 'text-white'
const SELECTED_TEXT = 'text-black'

const SELECTED_COLOUR = '!bg-lime-500'
const SELECTED_OUTLINE_COLOUR = 'outline-lime-600'

const APP_BACKGROUND = 'bg-slate-900'
const CONTENT_BACKGROUND = 'bg-[#1a1e45]'
const MODAL_BACKGROUND = 'bg-indigo-900'

export const classes = {
  app: {
    appBackground: APP_BACKGROUND,
    contentBackground: CONTENT_BACKGROUND,
    modalBackground: MODAL_BACKGROUND
  },
  hoverableButton: {
    default: `${BASE_COLOUR} ${HOVER_COLOUR} cursor-pointer text-center mx-auto rounded-2xl`,
    selected: `outline ${SELECTED_OUTLINE_COLOUR} outline-offset-2 ${SELECTED_COLOUR} ${SELECTED_TEXT} transform scale-[101%] transition-all`
  }
}