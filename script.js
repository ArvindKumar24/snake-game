const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

let box = 20;
let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let direction = "RIGHT";
let score = 0;
let gameRunning = true;
let speed = 150; // Slower movement

// Resize canvas dynamically
function resizeCanvas() {
    let size = Math.min(window.innerWidth - 20, 400);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Handle keyboard input
document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Mobile touch controls
let touchStartX, touchStartY;
document.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});
document.addEventListener("touchmove", e => {
    if (!touchStartX || !touchStartY) return;
    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;
    let dx = touchStartX - touchEndX;
    let dy = touchStartY - touchEndY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "RIGHT") direction = "LEFT";
        else if (dx < 0 && direction !== "LEFT") direction = "RIGHT";
    } else {
        if (dy > 0 && direction !== "DOWN") direction = "UP";
        else if (dy < 0 && direction !== "UP") direction = "DOWN";
    }
    touchStartX = null;
    touchStartY = null;
});

// Generate random food position
function randomPosition() {
    return Math.floor(Math.random() * (canvas.width / box)) * box;
}

// Game loop with slower speed
function gameLoop() {
    if (!gameRunning) return;
    
    let head = { ...snake[0] };
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Check collisions
    if (
        head.x < 0 || head.y < 0 || 
        head.x >= canvas.width || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameRunning = false;
        restartButton.style.display = "block"; // Show restart button
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: randomPosition(), y: randomPosition() };
    } else {
        snake.pop();
    }

    drawGame();
    setTimeout(() => requestAnimationFrame(gameLoop), speed);
}

// Draw game elements
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// Restart game function
function restartGame() {
    snake = [{ x: 100, y: 100 }];
    direction = "RIGHT";
    food = { x: randomPosition(), y: randomPosition() };
    score = 0;
    gameRunning = true;
    restartButton.style.display = "none"; // Hide restart button
    gameLoop();
}

// Start the game
gameLoop();