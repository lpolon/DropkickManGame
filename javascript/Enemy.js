class Enemy extends Component {
  constructor(context, width, height, posX = 10, posY = 200, color) {
    super();
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;

    this.limit = 300;
    this.velocity = 0.08;
  }

  move(delta) {
    // console.log(this.posX);
    // console.log(this.limit)
    this.posX += this.velocity * delta;
    if (this.posX >= this.limit || this.posX <= 0) this.velocity = -this.velocity;
    this.c.fillStyle = this.color;
    this.c.fillRect(this.posX, this.posY, this.width, this.height);
  }
}
