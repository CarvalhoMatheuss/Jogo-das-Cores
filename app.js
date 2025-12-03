// =============================
// CONFIGURAÇÕES DO JOGO
// =============================

// Paleta de cores
const COLORS = [
    "#FF0000", "#008000", "#0000FF", "#FFFF00",
    "#FF7F50", "#40E0D0", "#800080", "#FFA500",
    "#00FFFF", "#000000", "#FFFFFF", "#A52A2A"
];

// Variáveis do jogo
let targetColor = "";
let attempts = 3;
let gameActive = false;

// Elementos
const startButton = document.getElementById("start-button");
const boardGrid = document.querySelector(".board-grid");
const resultDiv = document.getElementById("result");
const body = document.body;


// =============================
// GERAR CORES + FORMAS ALEATÓRIAS
// =============================
function generateRandomTiles() {
    boardGrid.innerHTML = "";

    // Sorteia cor alvo
    targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    // Seleciona outras 8 cores diferentes da cor alvo
    let otherColors = COLORS.filter(c => c !== targetColor);
    otherColors = otherColors.sort(() => Math.random() - 0.5).slice(0, 8);

    // Junta tudo e embaralha
    const tiles = [...otherColors, targetColor].sort(() => Math.random() - 0.5);

    const shapeVariants = [
        "10%", "25%", "50%", "0%",
        "60% 40% 30% 70%", "50% 20% 50% 20%"
    ];

    tiles.forEach(color => {
        const tile = document.createElement("div");
        tile.classList.add("color-tile");

        tile.style.backgroundColor = color;
        tile.dataset.color = color;

        // Forma aleatória do tile
        tile.style.setProperty("--shape",
            shapeVariants[Math.floor(Math.random() * shapeVariants.length)]
        );

        // Clique no tile
        tile.addEventListener("click", handleGuess);

        boardGrid.appendChild(tile);
    });
}


// =============================
// INICIAR JOGO
// =============================
function startGame() {
    gameActive = true;
    attempts = 3;

    // Criar tiles
    generateRandomTiles();

    // Ativar fundo animado
    body.classList.add("moving-gradient");
    body.style.backgroundImage =
        `linear-gradient(45deg, ${COLORS.join(", ")})`;

    resultDiv.innerHTML = `<p>Tentativas restantes: <strong>3</strong></p>`;
    startButton.style.display = "none";
}


// =============================
// LÓGICA DE PALPITE
// =============================
function handleGuess(e) {
    if (!gameActive) return;

    const color = e.target.dataset.color;

    if (color === targetColor) {
        endGame(true);
    } else {
        attempts--;
        e.target.style.opacity = "0.25";
        e.target.style.pointerEvents = "none";

        if (attempts > 0) {
            resultDiv.innerHTML = `
                <p style="color: #ff5555;">❌ Errou!</p>
                <p>Tentativas restantes: <strong>${attempts}</strong></p>
            `;
        } else {
            endGame(false);
        }
    }
}


// =============================
// FINALIZAR JOGO
// =============================
function endGame(win) {
    gameActive = false;

    // Remover cliques
    document.querySelectorAll(".color-tile")
        .forEach(tile => tile.style.pointerEvents = "none");

    // Parar fundo animado e aplicar fundo final
    body.classList.remove("moving-gradient");
    body.style.backgroundImage = "none";
    body.style.backgroundColor = targetColor;

    if (win) {
        resultDiv.innerHTML = `
            <h2 style="color:#00ff88;">🎉 Você acertou!</h2>
            <p>A cor sorteada era: <strong style="color:${targetColor};">${targetColor}</strong></p>
        `;
    } else {
        resultDiv.innerHTML = `
            <h2 style="color:#ff4444;">😭 Você perdeu!</h2>
            <p>A cor correta era: <strong style="color:${targetColor};">${targetColor}</strong></p>
        `;
    }

    startButton.textContent = "Jogar Novamente";
    startButton.style.display = "block";
}


// =============================
// LISTENER DO BOTÃO
// =============================
startButton.addEventListener("click", startGame);
