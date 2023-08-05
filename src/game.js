import Player from "./player.js";

class Game {
  setup(names, gameType, playerClass = Player) {
    this.gameType = gameType;
    this.round = 0;
    this.players = names.map((name) => new playerClass(name));
    this.choices = ["rock", "paper", "scissors"];
  }

  player1() {
    return this.players[0];
  }

  player2() {
    return this.players[1];
  }

  incrementRound() {
    this.round++;
  }

  botChoice() {
    const randIndex = Math.floor(Math.random() * 3);

    return this.choices[randIndex];
  }

  play(p1Choice, p2Choice) {
    const player1Choice = p1Choice.toLowerCase();
    const player2Choice =
      this.gameType === "multi" ? p2Choice.toLowerCase() : this.botChoice();
    // console.log(
    //   "player1Choice: ",
    //   player1Choice,
    //   `\n`,
    //   "player2Choice: ",
    //   player2Choice
    // );
    if (player1Choice === player2Choice) return;

    if (player1Choice === "rock") {
      if (player2Choice === "scissors") {
        this.player1().addPoint();
        return;
      }
      this.player2().addPoint();
    }

    if (player1Choice === "paper") {
      if (player2Choice === "rock") {
        this.player1().addPoint();
        return;
      }

      this.player2().addPoint();
    }

    if (player1Choice === "scissors") {
      if (player2Choice === "paper") {
        this.player1().addPoint();
        return;
      }

      this.player2().addPoint();
    }
  }
}

export default Game;
