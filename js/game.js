const gameOptions = document.getElementsByClassName("game-options")[0];
const game = document.getElementsByClassName("game")[0];
const hintDiv = document.getElementsByClassName("guess-title")[0];
const musicPlayer = document.getElementById("player");
const currentWordDiv = document.getElementsByClassName("current-word")[0];
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const musicControlButtons = document.querySelectorAll(".music-control");
const streakTitle = document.getElementById("streak-title");

let category = "";
let currentWord = "";
let correctGuesses = [];
let wrongGuesses = [];
let musicOn = true;
let youtubePlayer = null;
let gameStatus = ""; // "", "playing", "won", "lost"
let max_wrong_guess = 8;
let wordPool = [];
let streak = 0;
let totalWords = 0;

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
  document.onkeyup = keyUp;

  selectRandomWord();
  displayCurrentWord();

  if (category == "hard") {
    cloudVelocity = 0.6;
    max_wrong_guess = 6;
  } else if (category == "medium") {
    cloudVelocity = 0.4;
    max_wrong_guess = 8;
  } else {
    // easy
    cloudVelocity = 0.2;
    max_wrong_guess = 10;
  }
  gameStatus = "playing";
}

function selectRandomWord() {
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
    correctWord();
  } else if (wrongGuesses.length >= max_wrong_guess) {
    wrongWord();
  }
}

function keyUp(e) {
  if (e.key === "Enter" && resetButton.value === "Next Word") {
    resetButton.onclick();
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

function correctWord() {
  streak++;
  totalWords++;
  gameStatus = "won";
  hintDiv.innerText = "Correct! 🎉";
  document.onkeypress = null;
  displayCurrentWord();
  moveOn();
}

function wrongWord() {
  totalWords++;
  gameStatus = "lost";
  hintDiv.innerText = "Nope... 🙈";
  document.onkeypress = null;
  displayCurrentWord();
  moveOn();
}

function moveOn() {
  // prepare for next step
  hintDiv.className += " game-title";
  const index = wordPool.indexOf(currentWord);
  if (index > 0) {
    wordPool.splice(index, 1);
  }

  if (wordPool.length) {
    // there are more words for guessing
    resetButton.className = "";
    resetButton.value = "Next Word";
    resetButton.onclick = nextWord;
  } else {
    // all words have been guessed
    resetButton.value = "Reset";
    resetButton.onclick = resetGame;
  }
}

function gameOver() {
  gameStatus = "lost";
  hintDiv.innerText = "Game Over! 😭";
  hintDiv.className += " game-title";
  streakTitle.className = "";
  streakTitle.innerText = `You found ${streak} out of ${totalWords} words.`;
  document.onkeypress = null;
  resetButton.className = "";
  resetButton.value = "Reset";
  resetButton.onclick = resetGame;
  displayCurrentWord();
}

function nextWord() {
  // refresh game
  gameStatus = "playing";
  hintDiv.innerText = HINT;
  let hintClasses = hintDiv.className.split(" ").filter(name => {
    return name !== "game-title";
  });
  hintDiv.className = hintClasses;
  resetButton.className += " hidden";
  document.onkeypress = guessLetter;

  correctGuesses = [];
  wrongGuesses = [];
  displayWrongGuesses();
  selectRandomWord();
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
