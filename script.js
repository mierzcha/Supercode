const colorDisplays = document.querySelectorAll('.color-display');
const colorLists = document.querySelectorAll('.color-list');
const colorOptions = document.querySelectorAll('.color-option');
const availableColors = ['red', 'blue', 'green', 'yellow', 'brown'];

let gameOver = false;
let currentTurn = 0;
const MAX_TURNS = 12;

let turnTime = 10; // Standardwert
let turnTimer;
let countdownInterval;

function startGame() {
    stopTimer(); // Überlappende timer vermeiden
    resetColorInputs();
    document.querySelector('#guesses').innerHTML = '';
    document.querySelector('#result').textContent = '';
    currentTurn = 0;
    gameOver = false;
    secretCode.length = 0;
    secretCode.push(...generateSecretCode());
    startTurnTimer();
}


function startTurnTimer() {
    stopTimer(); // alte timer stoppen

    let timeLeft = turnTime;
    updateTimerDisplay(timeLeft);

    countdownInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
    }, 1000);

    turnTimer = setTimeout(() => {
        clearInterval(countdownInterval);
        submitGuess(); // automatischer Zug
    }, turnTime * 1000);
}


function updateTimerDisplay(seconds) {
    let timerElement = document.querySelector('#turn-timer');
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'turn-timer';
        timerElement.style.fontSize = '20px';
        timerElement.style.marginTop = '10px';
        document.querySelector('#game-board').appendChild(timerElement);
    }
    timerElement.textContent = `⏳ Zeit: ${seconds}s`;
}

function stopTimer() {
    clearTimeout(turnTimer);
    clearInterval(countdownInterval);
    updateTimerDisplay(0); 
}

function resetColorInputs() {
    document.querySelectorAll('.color-display').forEach(display => {
        display.style.backgroundColor = 'gray'; 
    });
    document.querySelector('#result').textContent = ''; // Ergebnisanzeige leeren
    startTurnTimer();
}
resetColorInputs();

function restartGame() {
	//timer zurücksetzen
	stopTimer();
	
    //Anzahl Züge zurücksetzen
    currentTurn = 0;
    
    // Neues Secret
    secretCode = generateSecretCode();
    gameOver = false;

    // Entferne alte Guess-Zeilen
    document.querySelector('#guesses').innerHTML = '';

    // Reset Farbanzeige
    resetColorInputs();

    // Rückmeldung löschen
    document.querySelector('#result').textContent = '';
}

function generateSecretCode() {
    let code = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        code.push(availableColors[randomIndex]);
    }
    console.log('Secret Code:', code); // Zum Debuggen sichtbar machen
    return code;
}
let secretCode = generateSecretCode();

function evaluateGuess(secret, guess) {
    let black = 0, white = 0;
    let secretCopy = [...secret];
    let guessCopy = [...guess];

    // Schwarze Treffer (Farbe + Position)
    for (let i = 0; i < 4; i++) {
        if (guessCopy[i] === secretCopy[i]) {
            black++;
            secretCopy[i] = guessCopy[i] = null;
        }
    }

    // Weiße Treffer (nur Farbe)
    for (let i = 0; i < 4; i++) {
        if (guessCopy[i] != null) {
            const index = secretCopy.indexOf(guessCopy[i]);
            if (index !== -1) {
                white++;
                secretCopy[index] = null;
            }
        }
    }

    return { black, white };
}

function renderGuess(colors, result) {
    const guessesDiv = document.querySelector('#guesses');

    const row = document.createElement('div');
    row.classList.add('guess-row');

    const indexDiv = document.createElement('div');
    indexDiv.classList.add('index-number');
    indexDiv.textContent = guessesDiv.children.length + 1;
    row.appendChild(indexDiv);

    // Farben anzeigen
    colors.forEach(color => {
        const guessItem = document.createElement('div');
        guessItem.classList.add('guess-item');
        guessItem.setAttribute('data-color', color);
        row.appendChild(guessItem);
    });

    // Ergebnisse anzeigen (max. 4 kleine Punkte)
    const resultContainer1 = document.createElement('div');
    resultContainer1.classList.add('guess-result');

    const resultContainer2 = document.createElement('div');
    resultContainer2.classList.add('guess-result');

    const totalPins = [...Array(result.black).fill('black'), ...Array(result.white).fill('white')];
    while (totalPins.length < 4) totalPins.push('lavender'); // als Platzhalter

    totalPins.forEach((pinColor, index) => {
        const pin = document.createElement('div');
        pin.classList.add('guess-result-item');
        pin.setAttribute('data-color', pinColor);
        if (index < 2) {
            resultContainer1.appendChild(pin);
        } else {
            resultContainer2.appendChild(pin);
        }
    });

    row.appendChild(resultContainer1);
    row.appendChild(resultContainer2);

    guessesDiv.appendChild(row);

    // Siegbedingung prüfen
    if (result.black === 4) {
        document.querySelector('#result').textContent = "🎉 Du hast den Code geknackt!";
    }
}

function submitGuess() {
    if (gameOver) return;

    const selectedColors = Array.from(document.querySelectorAll('.color-display'))
        .map(el => {
            const bgColor = el.style.backgroundColor;
            return availableColors.find(color => color === bgColor) || null;
        });

    if (selectedColors.includes(null)) {
        alert("Bitte wähle alle vier Farben aus!");
        return;
    }

    const result = evaluateGuess(secretCode, selectedColors);
    console.log('Dein Tipp:', selectedColors);
    console.log('Ergebnis:', result);

    renderGuess(selectedColors, result);
    currentTurn++;

    if (result.black === 4) {
        document.querySelector('#result').textContent = "🎉 Du hast den Code geknackt!";
        gameOver = true;
        stopTimer();
        return;
    }

    if (currentTurn >= MAX_TURNS) {
        document.querySelector('#result').textContent = `💥 Game Over! Der Code war: ${secretCode.join(', ')}`;
        gameOver = true;
        stopTimer();
        currentTurn = 0;
        return;
    }

    startTurnTimer(); // Für den nächsten Zug
}


colorDisplays.forEach((display, index) => {
    display.addEventListener('click', () => {
        colorLists[index].classList.toggle('show');
    });
});

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const color = option.dataset.color;
        if (color) {
            option.parentNode.previousElementSibling.style.backgroundColor = color;
            option.parentNode.classList.toggle('show');
        }
    });
});

console.log(secretCode)

//Event-Listener:
//document.querySelector('#submit-guess').addEventListener('click', submitGuess);
document.querySelector('#start-game').addEventListener('click', () => {
    const inputTime = parseInt(document.querySelector('#turn-time').value, 10);
    if (!isNaN(inputTime) && inputTime >= 5 && inputTime <= 60) {
        turnTime = inputTime;
    } else {
        alert("Bitte eine gültige Zahl zwischen 5 und 60 eingeben.");
        return;
    }

    startGame();
});


document.querySelector('#submit-guess').addEventListener('click', () => {
    clearTimeout(turnTimer);
    clearInterval(countdownInterval);
    submitGuess();
});


document.querySelector('#restart-game').addEventListener('click', restartGame);




