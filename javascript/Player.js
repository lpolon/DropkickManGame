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
    facingDirection = 'left'
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

  draw(color = this.color, direction = this.facingDirection) {
    this.c.fillStyle = color;
    this.c.fillRect(this.posX, this.posY, this.width, this.height);
    this.drawFacingDirection(direction);
  }

  drawFacingDirection(facingDirection) {
    if (facingDirection === 'right') {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 19,
        this.posY + 5,
        this.width - this.width / 2,
        this.height - this.height / 2
      );
    } else if (facingDirection === 'left') {
      this.c.fillStyle = 'black';
      this.c.fillRect(
        this.posX + 1,
        this.posY + 5,
        this.width - this.width / 2,
        this.height - this.height / 2
      );
    }
  }

  // *** PLAYER MOVEMENT ***
  goLeft() {
    this.facingDirection = 'left';
    this.posX += -10;
  }

  goRight() {
    this.facingDirection = 'right';
    this.posX += 10;
  }

  goTop() {
    this.posY += -10;
  }

  gotBot() {
    this.posY += 10;
  }

  // *** PLAYER HITBOX ***
  _isRightCompBorderCollided(enemy) {
    return this._rightCompHb() >= enemy._leftCompHb();
  }

  _isLeftCompBorderCollided(enemy) {
    return this._leftCompHb() <= enemy._rightCompHb();
  }

  _isTopCompBorderCollided(enemy) {
    return this._topCompHb() <= enemy._botCompHb();
  }

  _isBottomCompBorderCollided(enemy) {
    return this._botCompHb() >= enemy._topCompHb();
  }

  isHitTaken(enemy) {
    return (
      this._isRightCompBorderCollided(enemy) &&
      this._isLeftCompBorderCollided(enemy) &&
      this._isTopCompBorderCollided(enemy) &&
      this._isBottomCompBorderCollided(enemy)
    );
  }

  // *** ATTACK STATE ***
  startAttack() {
    console.log('attack!');
    this.isAttacking = true;
  }

  stopAttack() {
    console.log('hello, stopAttacking()');
    this.isAttacking = false;
  }

  // *** ATTACK HITBOX ***
  drawAttackHitbox() {
    this.c.fillStyle = 'rebeccapurple';
    if (this.facingDirection === 'right') {
      this.c.fillRect(
        this.posX + 10,
        this.posY - 3,
        this.width,
        this.height - 5
      );
    } else {
      this.c.fillRect(
        this.posX - 10,
        this.posY - 3,
        this.width,
        this.height - 5
      );
    }
  }

  _leftAttackHb() {
    if (this.facingDirection === 'right') {
      return this.posX + 10;
    }
    return this.posX - 10;
  }

  _rightAttackHb() {
    if (this.facingDirection === 'right') {
      return this.posX + 10 + this.width;
    }
    return this.posX - 10 + this.width;
  }

  _topAttackHb() {
    return this.posY - 3;
  }

  _botAttackHb() {
    return this.posY - 3 + this.height - 5;
  }

  _isRightAttackBorderCollided(enemy) {
    return this._rightAttackHb() >= enemy._leftCompHb();
  }

  _isLeftAttackBorderCollided(enemy) {
    return this._leftAttackHb() <= enemy._rightCompHb();
  }

  _isTopAttackBorderCollided(enemy) {
    return this._topAttackHb() <= enemy._botCompHb();
  }

  _isBottomAttackBorderCollided(enemy) {
    return this._botAttackHb() >= enemy._topCompHb();
  }

  isHitGiven(enemy) {
    return (
      this._isRightAttackBorderCollided(enemy) &&
      this._isLeftAttackBorderCollided(enemy) &&
      this._isTopAttackBorderCollided(enemy) &&
      this._isBottomAttackBorderCollided(enemy)
    );
  }

}