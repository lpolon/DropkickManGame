/* eslint-disable no-underscore-dangle */
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

  // TODO: attack function
  startAttack() {
    console.log('attack!');
    this.isAttacking = true;
  }

  stopAttack() {
    console.log('hello, stopAttacking()')
    this.isAttacking = false;
  }

  drawAttackHitbox() {
    this.c.fillStyle = 'rebeccapurple';
    if (this.facingDirection === 'right') {

      this.c.fillRect(this.posX + 10, this.posY-3, this.width, this.height-5);
    } else {
      this.c.fillRect(this.posX - 10, this.posY-3, this.width, this.height-5);
    }
  }

  _isRightBorderCollided(enemy) {
    return this._rightCompHb() >= enemy._leftCompHb();
  }

  _isLeftBorderCollided(enemy) {
    return this._leftCompHb() <= enemy._rightCompHb();
  }

  _isTopBorderCollided(enemy) {
    return this._topCompHb() <= enemy._botCompHb();
  }

  _isBottomBorderCollided(enemy) {
    return this._botCompHb() >= enemy._topCompHb();
  }

  isHitReceived(enemy) {
    return (
      this._isRightBorderCollided(enemy) &&
      this._isLeftBorderCollided(enemy) &&
      this._isTopBorderCollided(enemy) &&
      this._isBottomBorderCollided(enemy)
    );
  }

}