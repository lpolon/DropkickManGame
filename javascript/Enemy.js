class Enemy extends Component {
  constructor(context, width, height, posX, posY, color) {
    super();
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;

    this.limit = 300;
    this.velocity = 0.08; // tweak it.
  }

  move(delta) {
    this.posX += this.velocity * delta;
    if (this.posX >= this.limit || this.posX <= 0) this.velocity = -this.velocity;
  }
}
