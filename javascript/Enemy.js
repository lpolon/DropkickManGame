/* eslint-disable no-underscore-dangle */
class Enemy extends Component {
  constructor(context, posX, posY, width, height, color, horizontalLimit) {
    super();
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.horizontalLimit = horizontalLimit;

    this.velocityX = 0.08; // tweak it.
    this.velocityY = 0.3;
    // this.velocityY
  }

  move(delta) {
    this.posX -= this.velocityX * delta;
    // if (this.posX >= this.limit || this.posX <= 0) this.velocityX = -this.velocityX;
  }

  fall(deltaValue) {
    this.posY += this.velocityY * deltaValue;
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
}
