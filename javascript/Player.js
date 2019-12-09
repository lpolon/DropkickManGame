class Player extends Component {
  goLeft() {
    this.posX += -10;
  }

  goRight() {
    this.posX += 10;
  }

  goTop() {
    this.posY += -10;
  }

  gotBot() {
    this.posY += 10;
  }
}