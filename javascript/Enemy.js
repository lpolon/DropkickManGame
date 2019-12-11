class Enemy extends Component {
  constructor(context, width, height, posX, posY, color, isBoss = false) {
    super();
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.isBoss = isBoss;

    this.limit = 300;
    this.velocityX = 0.08; // tweak it.
    this.velocityY = 0.4;
    // this.velocityY
  }

  move(delta) {
    this.posX += this.velocityX * delta;
    if (this.posX >= this.limit || this.posX <= 0) this.velocityX = -this.velocityX;
  }

  fall(deltaValue) {
    this.posY -= this.velocityY * deltaValue;
  }

}
