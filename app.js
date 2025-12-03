// -------------------------------
// LISTA DE CORES
// -------------------------------
const COLOR_LIST = [
    "#FF0000", "#008000", "#0000FF", "#FFFF00",
    "#FF7F50", "#40E0D0", "#800080", "#FFA500",
    "#00FFFF", "#000000", "#FFFFFF", "#A52A2A"
];

// -------------------------------
// VARIÁVEIS DO JOGO
// -------------------------------
let targetColor = "";
let attempts = 3;
let gameActive = false;

// -------------------------------
// ELEMENTOS DOM
// -------------------------------
const startBtn = document.getElementById("start-button");
const boardGrid = document.querySelector(".board-grid");
const resultDiv = document.getElementById("result");
const body = document.body;


// -------------------------------
// FUNÇÕES DO JOGO
// -------------------------------

// Gera 9 cores aleatórias, garante que uma delas será a cor alvo
function generateColors() {
    targetColor = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];

    const selected = new Set();
    while (selected.size < 8) {
        const c = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
        if (c !== targetColor) selected.add(c);
    }

    const colorArray = [...selected];
    const randomIndex = Math.floor(Math.random() * 9);
    colorArray.splice(randomIndex, 0, targetColor);

    return colorArray;
}

// Define a animação do fundo usando as cores da rodada
function applyBackgroundAnimation(colors) {
    const gradient = `linear-gradient(45deg, ${colors.join(", ")})`;
    body.style.backgroundImage = gradient;
    body.classList.add("moving-gradient");
}

// Cria o grid visualmente
function renderGrid(colors) {
    boardGrid.innerHTML = "";
    boardGrid.style.gridTemplateColumns = "repeat(3, 1fr)";

    colors.forEach(color => {
        const tile = document.createElement("div");
        tile.classList.add("color-tile");
        tile.style.backgroundColor = color;

        // shape aleatório
        const shapes = ["10%", "30%", "50%", "0%"];
        tile.style.setProperty("--shape", shapes[Math.floor(Math.random() * shapes.length)]);

        tile.dataset.color = color;
        tile.addEventListener("click", handleGuess);

        boardGrid.appendChild(tile);
    });
}

// Inicia jogo
function startGame() {
    gameActive = true;
    attempts = 3;

    const colors = generateColors();
    renderGrid(colors);

    applyBackgroundAnimation(colors);

    resultDiv.innerHTML = `<p>Tentativas restantes: <strong>${attempts}</strong></p>`;

    startBtn.style.display = "none";
}

// Lógica quando o jogador clica em uma cor
function handleGuess(event) {
    if (!gameActive) return;

    const chosen = event.target.dataset.color;

    if (chosen === targetColor) {
        endGame(true);
    } else {
        attempts--;
        event.target.style.opacity = "0.3";
        event.target.style.pointerEvents = "none";

        if (attempts > 0) {
            resultDiv.innerHTML = `
                <p style="color:#ff5555;">❌ Errou! Tente novamente.</p>
                <p>Tentativas restantes: <strong>${attempts}</strong></p>
            `;
        } else {
            endGame(false);
        }
    }
}

// Finalização da rodada
function endGame(win) {
    gameActive = false;

    document.querySelectorAll(".color-tile").forEach(tile => {
        tile.style.pointerEvents = "none";
    });

    // Fundo final
    body.classList.remove("moving-gradient");
    body.style.backgroundImage = "none";
    body.style.backgroundColor = targetColor;

    if (win) {
        resultDiv.innerHTML = `
            <h2 style="color:#00ff88;">🎉 Acertou!</h2>
            <p>A cor era: <strong>${targetColor}</strong></p>
        `;
    } else {
        resultDiv.innerHTML = `
            <h2 style="color:#ff5555;">❌ Você perdeu!</h2>
            <p>A cor correta era: <strong>${targetColor}</strong></p>
        `;

        const correctTile = document.querySelector(`.color-tile[data-color="${targetColor}"]`);
        if (correctTile) {
            correctTile.style.border = "5px solid white";
            correctTile.style.opacity = "1";
        }
    }

    startBtn.textContent = "Jogar Novamente";
    startBtn.style.display = "block";
}

// Evento
startBtn.addEventListener("click", startGame);
