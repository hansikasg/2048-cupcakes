const gridContainer = document.getElementById('grid-container');
const size = 4;
let grid = [];

const cupcakeImages = {
  2: 'img/2.png',
  4: 'img/4.png',
  8: 'img/8.png',
  16: 'img/16.png',
  32: 'img/32.png',
  64: 'img/64.png',
  128: 'img/128.png',
  256: 'img/256.png',
  512: 'img/512.png',
  1024: 'img/1024.png',
  2048: 'img/2048.png'
};

function createEmptyGrid() {
  grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = Array(size).fill(0);
  }
}

function drawGrid() {
  gridContainer.innerHTML = '';
  grid.forEach(row => {
    row.forEach(cell => {
      const div = document.createElement('div');
      div.className = 'tile';
      if (cell !== 0 && cupcakeImages[cell]) {
        div.style.backgroundImage = `url('${cupcakeImages[cell]}')`;
      } else {
        div.style.backgroundImage = '';
      }
      gridContainer.appendChild(div);
    });
  });
}

function getEmptyCells() {
  const empty = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  return empty;
}

function addRandomTile() {
  const empty = getEmptyCells();
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
  const arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  return arr.filter(val => val).concat(Array(size - arr.filter(val => val).length).fill(0));
}

function rotateGrid(clockwise = true) {
  const newGrid = createEmptyGridStructure();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (clockwise) {
        newGrid[c][size - 1 - r] = grid[r][c];
      } else {
        newGrid[size - 1 - c][r] = grid[r][c];
      }
    }
  }
  grid = newGrid;
}

function createEmptyGridStructure() {
  return Array(size).fill(null).map(() => Array(size).fill(0));
}

function move(direction) {
  let moved = false;

  if (direction === 'ArrowUp') rotateGrid(false);
  if (direction === 'ArrowDown') rotateGrid(true);
  if (direction === 'ArrowRight') grid = grid.map(row => row.reverse());

  const newGrid = [];
  for (let r = 0; r < size; r++) {
    const newRow = slide(grid[r]);
    newGrid.push(newRow);
    if (newRow.toString() !== grid[r].toString()) moved = true;
  }

  grid = newGrid;

  if (direction === 'ArrowRight') grid = grid.map(row => row.reverse());
  if (direction === 'ArrowDown') rotateGrid(false);
  if (direction === 'ArrowUp') rotateGrid(true);

  if (moved) {
    addRandomTile();
    drawGrid();
  }
}

document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    move(e.key);
  }
});

function init() {
  createEmptyGrid();
  addRandomTile();
  addRandomTile();
  drawGrid();
}

init();
