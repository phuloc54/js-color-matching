import { getPlayAgainButton, getTimerElement, getColorElementList } from './selectors.js'
import { PAIRS_COUNT } from './constants.js'

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return

  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * i)

    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export function getRandomColorPairs(count) {
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  // random count color
  for (let i = 0; i < count; i++) {
    var color = window.randomColor({ luminosity: 'dark', hue: hueList[i % hueList.length] })
    colorList.push(color)
  }

  // x2 colorList => Create 8 pair but it not shuffle
  const fullColorList = [...colorList, ...colorList]

  shuffle(fullColorList)

  return fullColorList
}

export function isWinGame() {
  const liList = Array.from(getColorElementList())
  if (liList) {
    return liList.filter((x) => x.classList.contains('active')).length === PAIRS_COUNT * 2
  }
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) {
    playAgainButton.classList.add('show')
  }
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.remove('show')
}

export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}

export function removeActiveFromLiElement() {
  const liList = Array.from(getColorElementList())
  if (liList) {
    liList.map((x) => (x.className = ''))
  }
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null

  function start() {
    clear()

    let currentSecond = seconds

    intervalId = setInterval(() => {
      // if (onChange) onChange(currentSecond)
      onChange?.(currentSecond)
      if (currentSecond < 0) {
        clear()
        onFinish?.()
      }
      currentSecond--
    }, 1000)
  }

  function clear() {
    clearInterval(intervalId)
  }
  return {
    start,
    clear,
  }
}
