let onOff = 0;
let dig = 0;
let originalMatrix = Array.from({ length: 4 }, () => Array(4).fill(" "));

function buildTable() {
    const table = document.getElementById("table");
    table.innerHTML = originalMatrix.map(row => `
        <tr>
            ${row.map(cell => `<td style="background-color: ${getTileColor(cell)};">${cell === " " ? "" : cell}</td>`).join('')}
        </tr>`).join('');
}

function setup() {
    addNumber();
    addNumber();
    render();
    score();
    displayHighScore();
}

function displayHighScore() {
    const highScore = localStorage.getItem("maxScore") || 0;
    document.getElementById("maxScore").innerText = highScore;
}

function getTileColor(value) {
    const colors = {
        2: '#ffebcc', 4: '#ffcc99', 8: '#ffb366', 16: '#ff9933', 32: '#ff8000',
        64: '#cc6600', 128: '#b35900', 256: '#994d00', 512: '#804000', 1024: '#663300',
        2048: '#4d2600', 4096: '#271401', 8192: '#000000'
    };
    return colors[value] || '#eee4da';
}

function addNumber() {
    const empty = [];
    originalMatrix.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === " ") empty.push({ r, c });
        });
    });
    if (empty.length > 0) {
        const { r, c } = empty[Math.floor(Math.random() * empty.length)];
        originalMatrix[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function move(direction) {
    const originalState = JSON.stringify(originalMatrix);
    let moved = false;

    function slideAndCombine(line) {
        let newLine = line.filter(x => x !== " ");
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                dig += newLine[i] / 2;
                newLine.splice(i + 1, 1);
                animateScore();
                showScoreIncrement(newLine[i]);
                moved = true;

                const scoreElement = document.getElementById("score");
                scoreElement.innerText = dig;

                if (onOff % 2 === 1) {
                    document.getElementById('off').style.display = "block";
                    document.getElementById('on').style.display = "none";
                    new Audio("../audio/syun.mp3").play().catch(console.error);
                } else {
                    document.getElementById('off').style.display = "none";
                    document.getElementById('on').style.display = "block";
                }
            }
        }
        while (newLine.length < 4) newLine.push(" ");
        return newLine;
    }

    const rotate = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]));

    if (direction === 'up' || direction === 'down') {
        let matrix = rotate(originalMatrix);
        for (let i = 0; i < 4; i++) {
            let line = matrix[i];
            matrix[i] = direction === 'up' ? slideAndCombine(line) : slideAndCombine(line.reverse()).reverse();
        }
        originalMatrix = rotate(matrix);
    } else {
        for (let r = 0; r < 4; r++) {
            let line = originalMatrix[r];
            originalMatrix[r] = direction === 'left' ? slideAndCombine(line) : slideAndCombine(line.reverse()).reverse();
        }
    }

    if (originalState !== JSON.stringify(originalMatrix)) {
        addNumber();
        render();
        updateScore(dig);
    }
}

function render() {
    console.clear();
    originalMatrix.forEach(row => console.log(row.join(' | ')));
    buildTable();
}

function score() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = localStorage.getItem("pi") || 0;
    const user = users[index];
    document.getElementById("name").innerText = "Hello  " + user?.username;
    document.getElementById("score").innerText = user?.score || 0;
    dig = user?.score || 0;
    updateScore(dig);
}

function updateScore(newScore) {
    document.getElementById("score").innerText = newScore;
    let maxScore = Number(localStorage.getItem("maxScore")) || 0;
    if (newScore > maxScore) {
        maxScore = newScore;
        localStorage.setItem("maxScore", maxScore);
    }
    document.getElementById("maxScore").innerText = maxScore;

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let index = Number(localStorage.getItem("pi") || 0);
    if (users[index]) {
        users[index].score = newScore;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

function showEndMessage(message) {
    document.getElementById("overlayMessage").innerText = message;
    document.getElementById("overlayMessage").style.display = "block";
}

function showEnd() {
    document.getElementById("retryP").style.display = "block";
}

function isGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (originalMatrix[r][c] === " ") return false;
            if (c < 3 && originalMatrix[r][c] === originalMatrix[r][c + 1]) return false;
            if (r < 3 && originalMatrix[r][c] === originalMatrix[r + 1][c]) return false;
        }
    }
    new Audio("../audio/זבנג.mp3").play().catch(console.error);
    return true;
}

function isWin() {
    return originalMatrix.flat().includes(2048);
}

function checkGameStatus() {
    if (isWin()) {
        showEndMessage("you win! well done!");
        new Audio("../audio/תרועת חצוצרה.mp3").play().catch(console.error);
        showEnd();
        document.removeEventListener("keydown", keyHandler);
    } else if (isGameOver()) {
        showEndMessage("you lose! game over!");
        showEnd();
        document.removeEventListener("keydown", keyHandler);
    }
}

function keyHandler(event) {
    switch (event.key) {
        case "ArrowUp": move("up"); break;
        case "ArrowDown": move("down"); break;
        case "ArrowLeft": move("left"); break;
        case "ArrowRight": move("right"); break;
    }
    checkGameStatus();
}

// התחלה
setup();

document.addEventListener("keydown", keyHandler);

// הדפסה
const printBtn = document.getElementById('print');
if (printBtn) printBtn.onclick = () => window.print();

// שמע
const audioBtn = document.getElementById("audio");
audioBtn.onclick = () => onOff++;


const leaderboardBtn = document.getElementById('leaderboardBtn');
leaderboardBtn.onclick = () => {
    window.location.href = "../html/leaderboard.html";
};


document.getElementById('retry').onclick = () => {
    location.replace("game.html");
};
function animateScore() {
    const scoreDiv = document.getElementById('score');
    scoreDiv.classList.add('score-animate');

    scoreDiv.addEventListener('animationend', () => {
        scoreDiv.classList.remove('score-animate');
    }, { once: true });
}

function showScoreIncrement(value) {
    const scoreDiv = document.getElementById('score');
    const increment = document.createElement('div');
    increment.classList.add('score-increment');
    increment.innerText = `+${value}`;

    const rect = scoreDiv.getBoundingClientRect();

    increment.style.left = rect.left + rect.width / 2 + 'px';
    increment.style.top = rect.top + 'px';
    increment.style.position = 'fixed'; 

    document.body.appendChild(increment);

    increment.addEventListener('animationend', () => {
        increment.remove();
    });
}