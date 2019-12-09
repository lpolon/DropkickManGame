let requestId;

const canvas = {
  element: document.getElementById('canvas'),
  context: document.getElementById('canvas').getContext('2d'),
};

const gameSetup = {
  setCanvasSize(width, height) {
    canvas.element.width = width;
    canvas.element.height = height;
  },

  build() {
    this.setCanvasSize(720, 630);
  },
};

const loopControl = {
  start() {
    if (!requestId) {
      requestId = window.requestAnimationFrame(gameLoop);
      // return requestId;
    }
  },
  stop() {
    if (requestId) {
      console.log('hello, stop');
      window.cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  },
  clear() {
    console.log('hello, clear');
    canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height)
  },
};


function gameLoop() {
  requestId = undefined;
  console.log('updating...');
  // do stuff

  loopControl.start();
}

gameSetup.build();
loopControl.start();
setTimeout(loopControl.clear, 3000);
setTimeout(loopControl.stop, 5000);