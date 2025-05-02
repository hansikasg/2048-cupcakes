<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2048 Cupcake Game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="game-container">
    <div id="header">
      <h1>2048 Cupcake</h1>
      <div id="score-box">Score: <span id="score">0</span></div>
    </div>
    <div id="grid-container"></div>
    <div id="game-over" style="display: none;">
      <div class="game-over-text">
        <p>Game Over!</p>
        <button onclick="restartGame()">Restart</button>
      </div>
    </div>
  </div>

  <script>
    const gridContainer = document.getElementById('grid-container');
    const scoreElement = document.getElementById('score');
    const gameOverOverlay = document.getElementById('game-over');
    const size = 4;
    let grid = [];
    let score = 0;

    const cupcakeImages = {
      2: 'img/2.png', 4: 'img/4.png', 8: 'img/8.png',
      16: 'img/16.png', 32: 'img/32.png', 64: 'img/64.png',
      128: 'img/128.png', 256: 'img/256.png', 512: 'img/512.png',
      1024: 'img/1024.png', 2048: 'img/2048.png'
    };

    function createEmptyGrid() {
      grid = Array(size).fill().map(() => Array(size).fill(0));
    }

    function drawGrid() {
      gridContainer.innerHTML = '';
      grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          const div = document.createElement('div');
          div.className = 'tile';
          div.style.transform = `translate(${c * 100}px, ${r * 100}px)`;
          if (cell !== 0 && cupcakeImages[cell]) {
            const img = document.createElement('img');
            img.src = cupcakeImages[cell];
            div.appendChild(img);
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
          score += arr[i];
          showScorePopup(arr[i]);
          arr[i + 1] = 0;
        }
      }
      const newRow = arr.filter(val => val);
      while (newRow.length < size) newRow.push(0);
      return newRow;
    }

    function showScorePopup(points) {
      const popup = document.createElement('div');
      popup.className = 'score-popup';
      popup.textContent = `+${points}`;
      popup.style.left = '50%';
      popup.style.top = '10px';
      popup.style.position = 'absolute';
      gridContainer.appendChild(popup);
      setTimeout(() => popup.remove(), 600);
    }

    function rotateGrid(clockwise = true) {
      const newGrid = Array(size).fill().map(() => Array(size).fill(0));
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
        scoreElement.textContent = score;
        if (isGameOver()) showGameOver();
      }
    }

    function isGameOver() {
      if (getEmptyCells().length > 0) return false;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const curr = grid[r][c];
          if ((r < size - 1 && grid[r + 1][c] === curr) || (c < size - 1 && grid[r][c + 1] === curr)) return false;
        }
      }
      return true;
    }

    function showGameOver() {
      gameOverOverlay.style.display = 'flex';
    }

    function restartGame() {
      score = 0;
      scoreElement.textContent = score;
      gameOverOverlay.style.display = 'none';
      createEmptyGrid();
      addRandomTile();
      addRandomTile();
      drawGrid();
    }

    document.addEventListener('keydown', (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        move(e.key);
      }
    });

    restartGame();
  </script>
</body>
</html>
