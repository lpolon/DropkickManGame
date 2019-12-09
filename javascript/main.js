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

// check for positions and status from everything in canvas.
const rules = {
  enemyArr: [],

  createBoss() {
    const boss = new Enemy(canvas.context, 80, 80, canvas.element.width - 200, canvas.element.height - 200, 'yellow');
    this.enemyArr.push(boss);
    return boss;
  },
  // create instances of components
  createEnemy() {
    
  },
  // check player collision against each element in enemyArr
  // stop game and console.log if any hit is detected.
  isGameover() {
    const isPlayerHit = this.enemyArr.some(e => {
      return player.isHit(e);
    });
    console.log(isPlayerHit);
    return isPlayerHit;
    // console.log(loopControl.stop())
  },
  // check boss colision against player with active status (or something like that)
  isWin() {},
}


/* MAIN GAME LOOP */
function update() {
  requestId = undefined;
  loopControl.clear();
  // start
  boss.draw();
  player.draw();

  if (rules.isGameover()) {
    console.log('game over!')
    loopControl.stop();
  } else {
    loopControl.start();
  }
  // end
}

/* calls */
gameSetup.build();
loopControl.start();

const boss = rules.createBoss();

const player = new Player(canvas.context, 40, 40, 450, canvas.element.height - 250, 'red',);

document.onkeydown = (input) => {
  if (input.keyCode === 37) {
    player.goLeft();
  } else if (input.keyCode === 39) {
    player.goRight();
  } 
  else if(input.keyCode === 38) {
    player.goTop();
  } 
  else if (input.keyCode === 40) {
    player.gotBot();
  }
};

// setTimeout(loopControl.clear, 3000);
// setTimeout(loopControl.stop, 10000);
