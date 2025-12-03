// -------------------------------
// LISTA DE CORES
// -------------------------------
const COLOR_LIST = [
    "#FF0000", "#008000", "#0000FF", "#FFFF00",
    "#FF7F50", "#40E0D0", "#800080", "#FFA500",
    "#00FFFF", "#4f7b4a", "#c05a3d", "#A52A2A"
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
let startBtn;
let boardGrid;
let resultDiv;
let body;

// -------------------------------
// INICIALIZAÇÃO
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Busca os elementos apenas uma vez
    startBtn = document.getElementById("start-button");
    boardGrid = document.querySelector(".board-grid");
    resultDiv = document.getElementById("result");
    body = document.body;

    // Adiciona o evento de clique apenas uma vez
    if (startBtn) {
        startBtn.addEventListener("click", startGame);
    }
});

// -------------------------------
// FUNÇÕES DO JOGO
// -------------------------------

function generateColors() {
    // Escolhe a cor alvo
    targetColor = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];

    const selected = new Set();
    // Garante que não repete cores na lista de preenchimento
    while (selected.size < 8) {
        const c = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
        if (c !== targetColor) selected.add(c);
    }

    const colorArray = [...selected];
    // Insere a cor alvo em uma posição aleatória
    const randomIndex = Math.floor(Math.random() * 9);
    colorArray.splice(randomIndex, 0, targetColor);

    return colorArray;
}

function applyBackgroundAnimation(colors) {
    const gradient = `linear-gradient(45deg, ${colors.join(", ")})`;
    body.style.backgroundImage = gradient;
    body.classList.add("moving-gradient");
}

function renderGrid(colors) {
    boardGrid.innerHTML = "";
    boardGrid.style.gridTemplateColumns = "repeat(3, 1fr)";

    colors.forEach(color => {
        const tile = document.createElement("div");
        tile.classList.add("color-tile");
        tile.style.backgroundColor = color;

        // Cria formas variadas usando variáveis CSS
        const shapes = ["10%", "30%", "50%", "0%"];
        tile.style.setProperty("--shape", shapes[Math.floor(Math.random() * shapes.length)]);

        tile.dataset.color = color;
        tile.addEventListener("click", handleGuess);

        boardGrid.appendChild(tile);
    });
}

function startGame() {
    gameActive = true;
    attempts = 3;

    const colors = generateColors();
    renderGrid(colors);

    applyBackgroundAnimation(colors);

    resultDiv.innerHTML = `<p>Tentativas restantes: <strong>${attempts}</strong></p>`;
    
    // Tratativa de erro caso o botão não seja encontrado
    startBtn.style.display = "none";
}

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

function endGame(win) {
    gameActive = false;

    // Desabilita cliques
    document.querySelectorAll(".color-tile").forEach(tile => {
        tile.style.pointerEvents = "none";
    });

    // Reset visual do fundo
    body.classList.remove("moving-gradient");
    body.style.backgroundImage = "none";
    body.style.backgroundColor = targetColor;

    if (win) {
        resultDiv.innerHTML = `
            <h2 style="color:#00ff88; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">🎉 Acertou!</h2>
            <p>A cor era: <strong>${targetColor}</strong></p>
        `;
    } else {
        resultDiv.innerHTML = `
            <h2 style="color:#ff5555; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">❌ Você perdeu!</h2>
            <p>A cor correta era: <strong>${targetColor}</strong></p>
        `;

        // Destaca qual a cor correta
        const correctTile = document.querySelector(`.color-tile[data-color="${targetColor}"]`);
        if (correctTile) {
            correctTile.style.border = "5px solid white";
            correctTile.style.opacity = "1";
            correctTile.style.transform = "scale(1.1)";
        }
    }

    // Mostra o botão novamente
    startBtn.textContent = "Jogar Novamente";
    startBtn.style.display = "inline-block"; // Garante que volta a aparecer
}