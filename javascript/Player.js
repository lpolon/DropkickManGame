// TODO: make super() work properly

class Player extends Component {
  constructor(
    context,
    width,
    height,
    posX,
    posY,
    color,
    facingDirection = 'left',
  ) {
    super();
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.facingDirection = facingDirection;
    this.isAttacking = false;
  }

  draw(color = this.color,
    direction = this.facingDirection,
    ) {
    this.c.fillStyle = color;
    this.c.fillRect(this.posX, this.posY, this.width, this.height);
    this.drawFacingDirection(direction);
  }

  drawFacingDirection(facingDirection) {
    if (facingDirection === 'right') {

      this.c.fillStyle = 'black';
      this.c.fillRect(this.posX+19, this.posY +5, this.width - this.width / 2, this.height - this.height / 2);
    } else if (facingDirection === 'left') {
      this.c.fillStyle = 'black';
      this.c.fillRect(this.posX+1, this.posY +5, this.width - this.width / 2, this.height - this.height / 2);
    }
  }

  goLeft() {
    this.posX += -10;
    this.facingDirection = 'left';
  }

  goRight() {
    this.posX += 10;
    this.facingDirection = 'right';
  }

  goTop() {
    this.posY += -10;
  }

  gotBot() {
    this.posY += 10;
  }

  // TODO: attack funcion
  startAttack() {
    console.log('attack!');
    this.isAttacking = true;
  }

  stopAttacking() {
    console.log('hello, stopAttacking()')
    this.isAttacking = false;
  }

  drawAttackHitbox() {
    this.c.fillStyle = 'rebeccapurple';
    if (this.facingDirection === 'right') {
      // TODO: this might clip badly
      this.c.fillRect(this.posX + 10, this.posY-3, this.width, this.height-5);
    } else {
      this.c.fillRect(this.posX - 10, this.posY-3, this.width, this.height-5);
    }
  }
}