class Player {
  constructor(name) {
    this.name = name;
    this.points = 0;
    this.choice = null;
  }

  addPoint() {
    this.points++;
  }

  chose(choice) {
    this.choice = choice;
  }
}

export default Player;
