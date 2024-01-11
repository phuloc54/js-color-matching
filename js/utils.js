function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return;

  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * i);

    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

export function getRandomColorPairs(count) {
  const colorList = [];
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

  // random count color
  for (let i = 0; i < count; i++) {
    var color = window.randomColor({ luminosity: 'dark', hue: hueList[i % hueList.length] });
    colorList.push(color);
  }

  // x2 colorList => Create 8 pair but it not shuffle
  const fullColorList = [...colorList, ...colorList];

  shuffle(fullColorList);

  return fullColorList;
}
