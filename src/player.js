class Player {
  constructor(name) {
    this.name = name;
    this.points = 0;
  }

  addPoint() {
    this.points++;
  }
}

export default Player;
