const colorDisplays = document.querySelectorAll('.color-display');
const colorLists = document.querySelectorAll('.color-list');
const colorOptions = document.querySelectorAll('.color-option');
const availableColors = ['red', 'blue', 'green', 'yellow', 'brown'];


function resetColorInputs() {
    document.querySelectorAll('.color-display').forEach(display => {
        display.style.backgroundColor = 'gray'; 
    });
    document.querySelector('#result').textContent = ''; // Ergebnisanzeige leeren
}
resetColorInputs();

function restartGame() {
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


let gameOver = false;

function submitGuess() {
	if (gameOver) return;
    const selectedColors = Array.from(document.querySelectorAll('.color-display'))
        .map(el => {
            const bgColor = el.style.backgroundColor;
            // Farbe als Farbname rückübersetzen
            return availableColors.find(color => color === bgColor) || null;
        });

    if (selectedColors.includes(null)) {
        alert("Bitte wähle alle vier Farben aus!");
        return;
    }

    const result = evaluateGuess(secretCode, selectedColors);
    if (result.black === 4) {
        document.querySelector('#result').textContent = "🎉 Du hast den Code geknackt!";
        gameOver = true;
    }
    console.log('Dein Tipp:', selectedColors);
    console.log('Ergebnis:', result);

    renderGuess(selectedColors, result);
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
document.querySelector('#submit-guess').addEventListener('click', submitGuess);
document.querySelector('#restart-game').addEventListener('click', restartGame);




