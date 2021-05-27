"use strict";

// score
const score = document.querySelector(".score__value");
// rules modal
const btnRules = document.querySelector(".btn-rules");
const modalRules = document.querySelector(".rules");
const overlayRules = document.querySelector(".overlay");
const modalClose = document.querySelector(".rules__close");
// initial and after view
const gameViewInitial = document.querySelector(".game__initial");
const gameViewAfter = document.querySelector(".game__after");
// after view icons
const iconPlayerContainer = document.querySelector(".icon--you-container");
const iconHouseContainer = document.querySelector(".icon--house-container");
// result view + play again button
const resultView = document.querySelector(".result");
const resultText = document.querySelector(".result__text");
const btnAgain = document.querySelector(".btn-again");

class App {
  constructor() {
    this.playerMove = "";
    this.houseMove = "";
    this.result = "";
    this.score = 0;
    this.iconPlayer = document.querySelector(".icon--you");
    this.iconHouse = document.querySelector(".icon--house");

    gameViewInitial.addEventListener(
      "click",
      this._moveSelectionHandler.bind(this)
    );
    btnAgain.addEventListener("click", this._playAgainHandler.bind(this));

    // MODAL LISTENERS
    btnRules.addEventListener("click", this._openModalHandler.bind(this));
    modalClose.addEventListener("click", this._closeModalHandler.bind(this));
    overlayRules.addEventListener("click", this._closeModalHandler.bind(this));
    document.addEventListener("keydown", this._closeModalEscape.bind(this));
  }

  //////////////////////////////////////////
  // MOVE SELECTION
  _moveSelectionHandler(e) {
    const el = e.target.closest(".icon");

    if (!el) return;

    this.playerMove = el.classList[1].slice(6);
    gameViewInitial.classList.add("hidden");
    this._gameViewAfterInit();
  }

  _createHouseMove() {
    const random = Math.trunc(Math.random() * 5);
    const moveMap = {
      0: "scissors",
      1: "paper",
      2: "rock",
      3: "lizard",
      4: "spock",
    };
    this.houseMove = moveMap[random];
  }

  //////////////////////////////////////////
  // SHOW AFTER VIEW

  _gameViewAfterInit() {
    gameViewAfter.classList.remove("hidden");
    resultView.classList.add("hidden");
    !this.iconPlayer || this.iconPlayer.remove();
    !this.iconHouse || this.iconHouse.remove();
    this._createHouseMove();
    iconPlayerContainer.insertAdjacentHTML(
      "afterbegin",
      this._createIconMarkup(this.playerMove, "you")
    );
    this.iconPlayer = document.querySelector(".icon--you");
    iconHouseContainer.insertAdjacentHTML(
      "beforeend",
      this._createIconMarkup(this.houseMove, "house")
    );
    this.iconHouse = document.querySelector(".icon--house");
    this._toggleHouseIconHidden();
    this._resultsInit();
  }

  _createIconMarkup(moveIcon, player) {
    if (player !== "you" && player !== "house") return;
    const html = `
    <div class="icon icon--${moveIcon} icon--${player}">
      <div class="icon__inner">
        <img
          src="./images/icon-${moveIcon}.svg"
          alt="${moveIcon} icon"
          class="icon__image"
        />
      </div>
    </div>`;
    return html;
  }

  //////////////////////////////////////////
  // RESULTS

  _resultsInit() {
    const timerShowHouse = setTimeout(
      this._toggleHouseIconHidden.bind(this),
      1000
    );
    const timerShowResult = setTimeout(this._showResult.bind(this), 2000);
    this._determineWinner();
  }

  _toggleHouseIconHidden() {
    this.iconHouse.classList.toggle("icon--hidden");
  }

  _showResult() {
    resultView.classList.remove("hidden");
    const resultMap = {
      win: ["You Win", 1],
      lose: ["You Lose", -1],
      tie: ["You're Tied", 0],
    };
    resultText.textContent = resultMap[this.result][0];
    this.score += resultMap[this.result][1];
    score.textContent = this.score;
    if (this.result === "win") {
      this.iconPlayer.classList.add("icon--winner");
    }
    if (this.result === "lose") {
      this.iconHouse.classList.add("icon--winner");
    }
  }

  _determineWinner() {
    // first player, then house
    const winMap = {
      scissors: {
        scissors: "tie",
        paper: "win",
        rock: "lose",
        lizard: "win",
        spock: "lose",
      },
      paper: {
        scissors: "lose",
        paper: "tie",
        rock: "win",
        lizard: "lose",
        spock: "win",
      },
      rock: {
        scissors: "win",
        paper: "lose",
        rock: "tie",
        lizard: "win",
        spock: "lose",
      },
      lizard: {
        scissors: "lose",
        paper: "win",
        rock: "lose",
        lizard: "tie",
        spock: "win",
      },
      spock: {
        scissors: "win",
        paper: "lose",
        rock: "win",
        lizard: "lose",
        spock: "tie",
      },
    };
    this.result = winMap[this.playerMove][this.houseMove];
  }

  //////////////////////////////////////////
  // PLAY AGAIN
  _playAgainHandler(e) {
    e.preventDefault();
    gameViewAfter.classList.add("hidden");
    gameViewInitial.classList.remove("hidden");
  }

  //////////////////////////////////////////
  // MODAL HANDLING
  _openModalHandler(e) {
    e.preventDefault();
    modalRules.classList.remove("hidden");
    overlayRules.classList.remove("hidden");
  }
  _closeModalHandler(e) {
    e.preventDefault();
    modalRules.classList.add("hidden");
    overlayRules.classList.add("hidden");
  }
  _closeModalEscape(e) {
    if (e.key === "Escape" && !modalRules.classList.contains("hidden")) {
      modalRules.classList.add("hidden");
      overlayRules.classList.add("hidden");
    }
  }
}

const app = new App();
