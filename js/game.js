// class Game {}

// class Sun {}

// class Cloud {}

const gameOptions = document.getElementsByClassName("game-options")[0];
const game = document.getElementsByClassName("game")[0];
const hintDiv = document.getElementsByClassName("guess-title")[0];
const currentWordDiv = document.getElementsByClassName("current-word")[0];
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

let category = "";
let currentWord = "";
let correctGuesses = [];
let wrongGuesses = [];

let gameStatus = ""; // "", "playing", "won", "lost"

function startGame(e) {
  let form = e.target.parentElement;
  let select = form.querySelector("select");
  let selectedCategory = select.options[select.selectedIndex].value;
  category = selectedCategory;

  // hide options
  gameOptions.className += " hidden";
  // show game
  let gameClasses = game.className.split(" ").filter(name => {
    return name !== "hidden";
  });
  game.className = gameClasses;
  hintDiv.innerText = HINT;
  // start detecting keyboard input
  document.onkeypress = guessLetter;
  // add dark background to copyright
  let copyright = document.querySelector(".copyright div");
  copyright.className += "dark-background";

  selectRandomWord();
  displayCurrentWord();

  cloudVelocity = 0.5;
  gameStatus = "playing";
}

function selectRandomWord() {
  let wordPool = [];
  switch (category) {
    case "movies":
      wordPool = words_movies;
      break;
    case "nature":
      wordPool = words_nature;
      break;
    case "all":
    default:
      wordPool = words_movies.concat(words_nature).concat(words_general);
      break;
  }

  let randomIndex = Math.floor(Math.random() * wordPool.length);
  currentWord = wordPool[randomIndex];
  console.log("currentWord: " + currentWord);
}

function guessLetter(e) {
  let letter = e.key.toLowerCase();
  if (!allowedChars.includes(letter)) {
    console.log("unsupported input: " + letter);
  }
  if (
    currentWord.includes(letter) ||
    currentWord.includes(letter.toUpperCase())
  ) {
    correctGuesses.push(letter);
  } else if (!wrongGuesses.includes(letter)) {
    wrongGuesses.push(letter);
  }

  displayCurrentWord();
  displayWrongGuesses();

  if (!currentWordDiv.innerText.includes("_")) {
    showGameWon();
  } else if (wrongGuesses.length >= MAX_WRONG_GUESS) {
    showGameOver();
  }
}

function displayCurrentWord() {
  currentWordDiv.innerText = "";
  for (let i = 0; i < currentWord.length; i++) {
    let letter = currentWord[i];
    if (
      correctGuesses.includes(letter) ||
      correctGuesses.includes(letter.toLowerCase())
    ) {
      currentWordDiv.innerHTML += " " + letter;
    } else if (gameStatus === "lost") {
      currentWordDiv.innerHTML += ` <span class="solution">${letter}</span>`;
    } else {
      currentWordDiv.innerHTML += " _";
    }
  }
}

function displayWrongGuesses() {
  let container = document.getElementsByClassName("wrong-guesses-letters")[0];
  container.innerText = "";
  wrongGuesses.forEach(letter => {
    container.innerText += " " + letter;
  });
}

function showGameWon() {
  gameStatus = "won";
  hintDiv.innerText = "You won! 🎉";
  hintDiv.className += " game-result";
  document.onkeypress = null;
  resetButton.className = "";
}

function showGameOver() {
  gameStatus = "lost";
  hintDiv.innerText = "You lost! 😭";
  hintDiv.className += " game-result";
  document.onkeypress = null;
  resetButton.className = "";
  displayCurrentWord();
}

function resetGame() {
  window.location.reload();
}

startButton.onclick = startGame;
resetButton.onclick = resetGame;
