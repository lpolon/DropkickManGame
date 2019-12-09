class Component {
  constructor(context, width, height, posX, posY, color) {
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
  }

  draw() {
    this.c.fillStyle = this.color;
    this.c.fillRect(this.posX, this.posY, this.width, this.height);
  }

  leftHb() {
    return this.posX;
  }

  rightHb() {
    return this.posX + this.width;
  }

  // talvez nao precise e eu nao tenho certeza se esta certo
  topHb() {
    return this.posY;
  }

  // talvez nao precise e eu nao tenho certeza se esta certo
  botHb() {
    return this.posY + this.height;
  }
}