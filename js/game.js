const gameOptions = document.getElementsByClassName("game-options")[0];
const game = document.getElementsByClassName("game")[0];
const hintDiv = document.getElementsByClassName("guess-title")[0];
const currentWordDiv = document.getElementsByClassName("current-word")[0];
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const musicControlButtons = document.querySelectorAll(".music-control");
const musicPlayer = document.getElementById("player");

let category = "";
let currentWord = "";
let correctGuesses = [];
let wrongGuesses = [];
let musicOn = true;
let youtubePlayer = null;
let gameStatus = ""; // "", "playing", "won", "lost"
let max_wrong_guess = 8;

function pageLoaded() {
  musicOn = true;
  musicControlButtons.forEach(button => {
    button.innerHTML = "🔊";
    button.onclick = toggleMusic;
  });
}

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

  if (category == "hard") {
    cloudVelocity = 0.8;
    max_wrong_guess = 6;
  } else if (category == "medium") {
    cloudVelocity = 0.6;
    max_wrong_guess = 8;
  } else {
    // easy
    cloudVelocity = 0.4;
    max_wrong_guess = 10;
  }
  gameStatus = "playing";
}

function selectRandomWord() {
  let wordPool = [];
  switch (category) {
    case "medium":
      wordPool = words_medium;
      break;
    case "hard":
      wordPool = words_hard;
      break;
    case "easy":
    default:
      wordPool = words_easy;
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
    return;
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
  } else if (wrongGuesses.length >= max_wrong_guess) {
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

  let title = document.getElementsByClassName("wrong-guesses-title")[0];
  title.innerText = `Wrong guesses (${wrongGuesses.length}/${max_wrong_guess}):`;
}

function showGameWon() {
  gameStatus = "won";
  hintDiv.innerText = "You won! 🎉";
  hintDiv.className += " game-title";
  document.onkeypress = null;
  resetButton.className = "";
}

function showGameOver() {
  gameStatus = "lost";
  hintDiv.innerText = "You lost! 😭";
  hintDiv.className += " game-title";
  document.onkeypress = null;
  resetButton.className = "";
  displayCurrentWord();
}

function resetGame() {
  window.location.reload();
}

// will be called when https://www.youtube.com/iframe_api is loaded
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player("player", {});
}

function toggleMusic() {
  musicControlButtons.forEach(button => {
    let container = button.parentElement.parentElement;
    if (container.className.split(" ").includes("hidden")) {
      // do nothing for hidden buttons
      return;
    }

    if (musicOn) {
      musicOn = false;
      button.innerHTML = "🔇";
      if (youtubePlayer) {
        youtubePlayer.mute();
      }
    } else {
      musicOn = true;
      button.innerHTML = "🔊";
      if (youtubePlayer) {
        youtubePlayer.unMute();
      }
    }
  });
}

startButton.onclick = startGame;
resetButton.onclick = resetGame;
