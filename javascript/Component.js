/* eslint-disable no-underscore-dangle */
class Component {
  constructor(context, width, height, posX, posY, color) {
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
  }

  draw(color = this.color) {
    this.c.fillStyle = color;
    this.c.fillRect(this.posX, this.posY, this.width, this.height);
  }

  _leftHb() {
    return this.posX;
  }

  _rightHb() {
    return this.posX + this.width;
  }

  // talvez nao precise e eu nao tenho certeza se esta certo
  _topHb() {
    return this.posY;
  }

  // talvez nao precise e eu nao tenho certeza se esta certo
  _botHb() {
    return this.posY + this.height;
  }

  _isRightBorderCollided(that) {
    return this._rightHb() >= that._leftHb();
  }

  _isLeftBorderCollided(that) {
    return this._leftHb() <= that._rightHb();
  }

  _isTopBorderCollided(that) {
    return this._topHb() <= that._botHb();
  }

  _isBottomBorderCollided(that) {
    return this._botHb() >= that._topHb();
  }

  isHit(that) {
    return (
      this._isRightBorderCollided(that) &&
      this._isLeftBorderCollided(that) &&
      this._isTopBorderCollided(that) &&
      this._isBottomBorderCollided(that)
    );
  }
}
