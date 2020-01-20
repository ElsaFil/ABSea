// class Game {}

// class Sun {}

// class Cloud {}

const gameOptions = document.getElementsByClassName("game-options")[0];
const game = document.getElementsByClassName("game")[0];
const currentWordDiv = document.getElementsByClassName("current-word")[0];

let category = "";
let currentWord = "";
let correctGuesses = [];
let wrongGuesses = [];

let gameOver = false;

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
  // start detecting keyboard input
  document.onkeypress = guessLetter;
  // add dark background to copyright
  let copyright = document.querySelector(".copyright div");
  copyright.className += "dark-background";

  selectRandomWord();
  displayCurrentWord();

  cloudVelocity = 0.5;
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
  } else {
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
      currentWordDiv.innerText += " " + letter;
    } else {
      currentWordDiv.innerText += " _";
    }
  }
}

function displayWrongGuesses() {
  let container = document.getElementsByClassName("wrong-guesses-letters")[0];
  container.innerText = "";
  wrongGuesses.forEach(letter => {
    container.innerText += letter + " ";
  });
}

function showGameWon() {
  alert("You won! 🎉");
  // stop detecting keyboard input
  document.onkeypress = null;
}

function showGameOver() {
  alert("You lost! ☹️");
  gameOver = true;
  // stop detecting keyboard input
  document.onkeypress = null;
}

document.getElementById("start-button").onclick = startGame;
