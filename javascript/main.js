let requestId;

const canvas = {
  element: document.getElementById('canvas'),
  context: document.getElementById('canvas').getContext('2d');
};

const gameSetup = {
  setCanvasSize(width, height) {
    canvas.element.width = width;
    canvas.element.height = height;
  },

  build() {
    this.setCanvasSize(720, 630);
  }
};

const loopControl = {
  start() {
    if (!requestId) {
      requestId = window.requestAnimationFrame(update);
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
    canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
  }
};

function update() {
  requestId = undefined;
  loopControl.clear();
  // start
  boss.draw();
  player.draw();

  // end
  loopControl.start();
}

gameSetup.build();
loopControl.start();
const boss = new Enemy(
  canvas.context,
  160,
  160,
  canvas.element.width - 200,
  canvas.element.height - 200,
  'yellow'
);

const player = new Player(
  canvas.context,
  40,
  40,
  200,
  canvas.element.height - 200,
  'red'
);

console.log(boss);
// setTimeout(loopControl.clear, 3000);
// setTimeout(loopControl.stop, 5000);
