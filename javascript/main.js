const canvas = {
  element: document.getElementById('canvas'),
  context: document.getElementById('canvas').getContext('2d')
};

const gameSetup = {
  setCanvasSize(width, height) {
    canvas.element.width = width;
    canvas.element.height = height;
  },

  build() {
    this.setCanvasSize(480, 549);
  },
};

gameSetup.build();