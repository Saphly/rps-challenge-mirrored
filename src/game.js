import Player from "./player.js";

class Game {
  setup(names, gameType, playerClass = Player) {
    this.gameType = gameType;
    this.round = 1;
    this.players = names.map((name) => new playerClass(name));
    this.choices = ["rock", "paper", "scissors", "spock", "lizard"];
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
    const randIndex = Math.floor(Math.random() * 5);

    return this.choices[randIndex];
  }

  play(p1Choice, p2Choice) {
    const player1Choice = p1Choice.toLowerCase();
    const player2Choice =
      this.gameType === "multi" ? p2Choice.toLowerCase() : this.botChoice();

    if (player1Choice === player2Choice) return;

    if (player1Choice === "rock") {
      if (player2Choice === "scissors" || player2Choice === "lizard") {
        this.player1().addPoint();
        return;
      }
      this.player2().addPoint();
    }

    if (player1Choice === "paper") {
      if (player2Choice === "rock" || player2Choice === "spock") {
        this.player1().addPoint();
        return;
      }

      this.player2().addPoint();
    }

    if (player1Choice === "scissors") {
      if (player2Choice === "paper" || player2Choice === "lizard") {
        this.player1().addPoint();
        return;
      }

      this.player2().addPoint();
    }

    if (player1Choice === "spock") {
      if (player2Choice === "rock" || player2Choice === "scissors") {
        this.player1().addPoint();
        return;
      }

      this.player2().addPoint();
    }

    if (player1Choice === "lizard") {
      if (player2Choice === "paper" || player2Choice === "spock") {
        this.player1().addPoint();
        return;
      }

      this.player2().addPoint();
    }
  }
}

export default Game;
