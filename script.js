const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 40; // Taille des cases
const tileCount = 15; // Nombre de cases
const imageSizeMultiplier = 2; // Facteur de multiplication pour agrandir les images
canvas.width = 600; // Fixer la largeur du canvas
canvas.height = 600; // Fixer la hauteur du canvas

let snake = [{ x: 7, y: 7 }]; // Le serpent commence avec une taille d'une case
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let speed = 300; // Temps initial entre chaque mouvement en millisecondes
let playerName = ""; // Pseudo du joueur
let highScore = 0; // Meilleur score
let gameActive = false; // Indicateur pour savoir si le jeu est en cours

// Charger les images
const snakeHeadImage = new Image();
snakeHeadImage.src = 'bts.png'; // Utilisation de l'image bts.png pour le serpent

const foodImage = new Image();
foodImage.src = 'purple_heart.png'; // Utilisation de l'image purple_heart.png pour la nourriture

// Elements HTML pour le pseudo et les scores
const playerNameInput = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const currentScoreDisplay = document.getElementById("currentScore");
const highScoreDisplay = document.getElementById("highScore");

// Charger le meilleur score du joueur à partir du localStorage
function loadHighScore() {
    const storedScore = localStorage.getItem(`${playerName}_highScore`);
    if (storedScore) {
        highScore = parseInt(storedScore);
        highScoreDisplay.textContent = highScore;
    }
}

// Enregistrer le meilleur score du joueur dans le localStorage
function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(`${playerName}_highScore`, highScore);
        highScoreDisplay.textContent = highScore;
    }
}

function gameLoop() {
    if (!gameActive) return; // Ne pas continuer si le jeu est terminé
    update();
    draw();
    setTimeout(gameLoop, speed);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreDisplay.textContent = score;
        saveHighScore();
        speed = Math.max(100, speed - 10); // Accélère progressivement le jeu
        // Générer une nouvelle position pour la nourriture en s'assurant qu'elle ne soit pas trop près des bords
        food = {
            x: Math.floor(Math.random() * (tileCount - imageSizeMultiplier)),
            y: Math.floor(Math.random() * (tileCount - imageSizeMultiplier))
        };
        // Ajuster pour garder la nourriture dans la zone visible
        if (food.x < imageSizeMultiplier) food.x = imageSizeMultiplier;
        if (food.y < imageSizeMultiplier) food.y = imageSizeMultiplier;
    } else {
        snake.pop(); // Enlève la dernière partie du serpent s'il ne mange pas
    }

    snake.unshift(head); // Ajoute une nouvelle tête

    // Check collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le serpent
    for (let i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeHeadImage, snake[i].x * gridSize, snake[i].y * gridSize, gridSize * imageSizeMultiplier, gridSize * imageSizeMultiplier);
    }

    // Dessiner la nourriture
    ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize * imageSizeMultiplier, gridSize * imageSizeMultiplier);

    // Dessiner le score actuel (en plus du score affiché en dehors du canvas)
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

function resetGame() {
    snake = [{ x: 7, y: 7 }];
    direction = { x: 0, y: 0 };
    score = 0;
    currentScoreDisplay.textContent = score;
    speed = 300; // Réinitialiser la vitesse
    gameActive = false; // Arrêter le jeu
}

// Terminer le jeu en cours
function endGame() {
    gameActive = false;
    alert(`Game Over! Ton score: ${score}`);
    resetGame();
}

// Démarrer le jeu avec le pseudo du joueur
startButton.addEventListener("click", () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        loadHighScore();
        gameActive = true;
        gameLoop();
    } else {
        alert("Veuillez entrer un pseudo pour commencer !");
    }
});

window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

gameLoop();
