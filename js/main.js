import { GAME_STATUS, PAIRS_COUNT } from './constants.js';
import { getColorElementList, getColorListElement } from './selectors.js';
import { getRandomColorPairs } from './utils.js';

// Global variables
let selections = [];
let gameState = GAME_STATUS.PLAYING;

selections = getRandomColorPairs(PAIRS_COUNT);

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
function isContainTwoCellActive(cellList) {
  return cellList.filter((x) => x.classList.contains('active')).length === 3;
}

function removeCellActiveRight(cellList) {
  for (const cell of cellList) {
    // if () { // add more 1 condition for not hidden right result

    // }
    cell.classList.remove('active');
  }
}

function bindColorForOverlay(cell, index) {
  const overlayElement = cell.querySelector('.overlay');
  if (overlayElement) {
    overlayElement.style.background = selections[index];
  }
}

function handleOnCellClick(cell) {
  if (!cell) return;
  cell.classList.add('active');

  const cellList = getColorElementList();
  if (!cellList) return;
  if (isContainTwoCellActive(Array.from(cellList))) {
    removeCellActiveRight(cellList);
  }
}

function initCellElementList() {
  const liList = getColorElementList();
  const ulElement = getColorListElement(); // ul element
  if (!ulElement) return;

  liList.forEach((cell, index) => {
    cell.dataset.idx = index;
    bindColorForOverlay(cell, index);
  });

  ulElement.addEventListener('click', (event) => {
    let cell = event.target.closest('li');

    if (!cell) return;
    if (!ulElement.contains(cell)) return;

    handleOnCellClick(cell);
  });
}

(() => {
  initCellElementList();
})();
