import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorElementList,
  getColorListElement,
  getTimerElement,
  getPlayAgainButton,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hidePlayAgainButton,
  isWinGame,
  removeActiveFromLiElement,
  setTimerText,
  showPlayAgainButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColor() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  const liList = getColorElementList()
  if (!liList) return

  liList.forEach((liElement, index) => {
    const overlayElement = liElement.querySelector('.overlay')
    if (!overlayElement) return
    overlayElement.style.backgroundColor = colorList[index]
    // add more attribute: dataset.color
    liElement.dataset.color = colorList[index]
  })
}

function handleClickOnColor(liElement) {
  // not allow to click on cell color when it is blocking or game is finished
  const shouldBlockClick = [GAME_STATUS.FINISHED, GAME_STATUS.BLOCKING].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || isClicked || shouldBlockClick) return

  liElement.classList.add('active')

  // save clicked element to selections
  selections.push(liElement)
  if (selections.length < 2) return // Do nothing

  // check two element is match?
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor
  if (isMatch) {
    selections = []
    if (isWinGame()) {
      showPlayAgainButton()
      setTimerText('You Win')
      gameStatus = GAME_STATUS.FINISHED
      timer.clear()
    }
    return
  }
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    // reset selections for the next turn
    selections = []

    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function attackEventForColorList() {
  const ulElement = getColorListElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return

    handleClickOnColor(event.target)
  })
}

function resetGame() {
  // Reset global variables
  selections = []
  gameStatus = GAME_STATUS.PLAYING

  // Re-Generate new colors
  initColor()

  // Reset DOM
  // 1. Remove class 'active' from li element
  removeActiveFromLiElement()

  // 2.hide play again button
  hidePlayAgainButton()

  // 3. Clear timer text
  setTimerText('')

  // Start new game
  startTimer()
}

function attackEventPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) {
    playAgainButton.addEventListener('click', resetGame)
  }
}

const timer = createTimer({
  seconds: GAME_TIME - 1,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(currentSecond) {
  const fullSecond = `0${currentSecond}`.slice(-2)
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = fullSecond + 's'
}

function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('Game Over')
  showPlayAgainButton()
}

function startTimer() {
  timer.start()
}

;(() => {
  initColor()

  attackEventForColorList()

  attackEventPlayAgainButton()

  startTimer()
})()
