const mazeContainer = document.getElementById("maze-container");
const stepCounter = document.getElementById("step-counter");
const difficultySelector = document.getElementById("difficulty");
const startButton = document.getElementById("start-game");

let maze = [];
let player = { x: 0, y: 0 };
let end = { x: 0, y: 0 };
let steps = 0;

function generateMaze(size) {
  console.log(`Starting maze generation with size: ${size}`); // Debugging

  function createGuaranteedPath() {
    console.log("Creating guaranteed path...");
    maze = Array.from({ length: size }, () => Array(size).fill(1));

    const stack = [{ x: 0, y: 0 }];
    maze[0][0] = 0; // Start point
    const directions = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 },  // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 },  // Right
    ];

    while (stack.length) {
      const current = stack.pop();
      const { x, y } = current;

      directions.sort(() => Math.random() - 0.5);

      for (const { x: dx, y: dy } of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (
          nx >= 0 &&
          nx < size &&
          ny >= 0 &&
          ny < size &&
          maze[ny][nx] === 1
        ) {
          maze[ny][nx] = 0;
          maze[y + dy][x + dx] = 0;
          stack.push({ x: nx, y: ny });
        }
      }
    }

    player = { x: 0, y: 0 };
    end = { x: size - 1, y: size - 1 };
  }

  function isPathPossible() {
    console.log("Validating path...");
    const visited = Array.from({ length: size }, () =>
      Array(size).fill(false)
    );
    const queue = [{ x: 0, y: 0 }];
    visited[0][0] = true;

    while (queue.length) {
      const { x, y } = queue.shift();

      if (x === end.x && y === end.y) return true;

      for (const { x: dx, y: dy } of [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ]) {
        const nx = x + dx;
        const ny = y + dy;

        if (
          nx >= 0 &&
          nx < size &&
          ny >= 0 &&
          ny < size &&
          !visited[ny][nx] &&
          maze[ny][nx] === 0
        ) {
          visited[ny][nx] = true;
          queue.push({ x: nx, y: ny });
        }
      }
    }

    return false;
  }

  let attempts = 0;
  do {
    console.log(`Attempt ${attempts + 1} to generate a solvable maze`);
    createGuaranteedPath();
    attempts++;
    if (attempts > 50) {
      console.error("Failed to generate a solvable maze after 50 attempts.");
      alert("Maze generation failed. Please try again.");
      return;
    }
  } while (!isPathPossible());

  console.log("Maze successfully generated and solvable!");
}

function drawMaze() {
  mazeContainer.innerHTML = "";
  const size = maze.length;
  mazeContainer.style.gridTemplateColumns = `repeat(${size}, 30px)`;

  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      if (cell === 1) div.classList.add("wall");
      if (x === player.x && y === player.y) div.classList.add("pickle");
      if (x === end.x && y === end.y) div.classList.add("end");
      mazeContainer.appendChild(div);
    });
  });
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;

  if (
    newX >= 0 &&
    newX < maze.length &&
    newY >= 0 &&
    newY < maze.length &&
    maze[newY][newX] === 0
  ) {
    player.x = newX;
    player.y = newY;
    steps++;
    stepCounter.textContent = steps;

    if (player.x === end.x && player.y === end.y) {
      alert(`You reached the end in ${steps} steps!`);
      resetGame();
    }

    drawMaze();
  }
}

function resetGame() {
  steps = 0;
  stepCounter.textContent = steps;
}

function startGame() {
  const size = parseInt(difficultySelector.value);
  console.log(`Starting game with difficulty size: ${size}`);

  if (isNaN(size)) {
    alert("Invalid difficulty selected. Please try again.");
    return;
  }

  generateMaze(size);
  resetGame();
  drawMaze();
}

document.addEventListener("keydown", (e) => {
  if (!maze.length) return;

  switch (e.key.toLowerCase()) {
    case "arrowup":
    case "w":
      movePlayer(0, -1);
      break;
    case "arrowdown":
    case "s":
      movePlayer(0, 1);
      break;
    case "arrowleft":
    case "a":
      movePlayer(-1, 0);
      break;
    case "arrowright":
    case "d":
      movePlayer(1, 0);
      break;
  }
});

startButton.addEventListener("click", startGame);
