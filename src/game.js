import Player from "./player.js";

const CHOICES = ["rock", "paper", "scissors", "spock", "lizard"];
// e.g. rock beats scissors and lizard
const RPS_LOGIC = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  spock: ["rock", "scissors"],
  lizard: ["paper", "spock"],
};

class Game {
  setup(names, gameType, playerClass = Player) {
    this.gameType = gameType;
    this.round = 1;
    this.players = names.map((name) => new playerClass(name));
  }

  player1() {
    return this.players[0];
  }

  player2() {
    return this.players[1];
  }

  winner() {
    const p1Points = this.player1().points;
    const p2Points = this.player2().points;

    if (p1Points === p2Points) return { name: "It's a tie", points: p1Points };
    if (p1Points > p2Points) return this.player1();

    return this.player2();
  }

  incrementRound() {
    this.round++;
  }

  botChoice() {
    const randIndex = Math.floor(Math.random() * CHOICES.length);

    return CHOICES[randIndex].toLowerCase();
  }

  incrementWinnerPoint(player1Choice, player2Choice) {
    if (player1Choice === player2Choice) return;

    if (RPS_LOGIC[player1Choice].includes(player2Choice)) {
      this.player1().addPoint();
      return;
    }
    this.player2().addPoint();
  }

  play(p1Choice, p2Choice) {
    const player1Choice = p1Choice.toLowerCase();
    const player2Choice =
      this.gameType === "multi" ? p2Choice.toLowerCase() : this.botChoice();

    this.player1().chose(player1Choice);
    this.player2().chose(player2Choice);

    this.incrementWinnerPoint(player1Choice, player2Choice);
  }
}

export default Game;
