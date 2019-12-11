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

// global variables
let requestId;
let lastFrameTimeMs = 0;
const maxFPS = 61; // update this value to control maxFPS
let delta = 0; // elapsed time since last update.
const timestep = 1000 / 60; // update the denominator to control maxFPS

let victoryToken;
let gameOverToken;

let frequencyInMs = 1000;

// controller of game rules
const rules = {
  enemyArr: [],
  allCompArr: [],
  // TODO: check if any enemy is hit by attack array. check if it is a boss.
  createBoss() {
    const boss = new Enemy(
      canvas.context,
      80,
      80,
      canvas.element.width - 100,
      canvas.element.height - 100,
      'yellow', true,
    );
    this.allCompArr.push(boss);
    return boss;
  },
  // create instances of components
  createEnemy(runtime, frequencyInMs, bossPositionX, bossPositionY) {
    // console.log('hello, create enemy function')
    // console.log(parseInt(runtime, 10));
    // console.log(frequencyInMs);
    // console.log('result: ', parseInt(runtime, 10) % frequencyInMs);
    // TODO: after about 30 seconds this becomes inconsistent.
    if (Math.floor(parseInt(runtime, 10)) % frequencyInMs > frequencyInMs - 17) {
      console.log('create enemy! ', runtime);
      const enemy = new Enemy(canvas.context, 50, 50, bossPositionX - 10, bossPositionY, 'pink');
      this.allCompArr.push(enemy);
      this.enemyArr.push(enemy);
      return enemy;
    }

  },

  createPlayer() {
    const player = new Player(
      canvas.context,
      40,
      40,
      450,
      canvas.element.height - 100,
      'red',
    );
    this.allCompArr.push(player);
    return player;
  },

  isGameover() {
    const isPlayerHitByEnemy = this.enemyArr.some(e => {
      return player.isHitTaken(e);
    });
    const isPlayerHitByBoss = player.isHitTaken(boss);
    return isPlayerHitByEnemy || isPlayerHitByBoss;
  },
  isHitGiven() {
    const isEnemyHit = this.enemyArr.some(e => {
      return player.isHitGiven(e);
    });
    return isEnemyHit;
  },
  // TODO: check if this is working with attack;
  isVictory() {
    return player.isHitGiven(boss);
  }
};

// TODO: instanciation should be handled by rules
const boss = rules.createBoss();
const player = rules.createPlayer();

// const box2 = new Enemy(canvas.context, 40, 40, 150, 250, 'red');
// const box = new Enemy(canvas.context, 40, 40, 100, 200, 'pink');
// const box3 = new Enemy(canvas.context, 40, 40, 50, 150, 'yellow');

// *** INPUTS ***

const inputStatusObj = {
  17: [false, 0],
  37: [false, 0],
  39: [false, 0],
};

const updatePlayerMovement = (deltaValue) => {
  if (inputStatusObj[37][0] && inputStatusObj[39][0]) {
    if (inputStatusObj[37][1] > inputStatusObj[39][1]) {
      player.goLeft(deltaValue);
    } else {
      player.goRight(deltaValue);
    }
  }
  if (inputStatusObj[37][0]) {
    player.goLeft(deltaValue);
  }
  if (inputStatusObj[39][0]) {
    player.goRight(deltaValue);
  }
}

const handleMoveInputKeyDown = input => {
  switch (input.keyCode) {
    case 37:
      inputStatusObj[input.keyCode] = [true, new Date().getTime()];
      break;
    case 39:
      inputStatusObj[input.keyCode] = [true, new Date().getTime()];
      break;
    default:
      break;
  }
};
document.addEventListener('keydown', handleMoveInputKeyDown);

const handleMoveInputKeyUp = input => {
  switch (input.keyCode) {
    case 37:
      inputStatusObj[input.keyCode] = [false, 0];
      break;
    case 39:
      inputStatusObj[input.keyCode] = [false, 0];
      break;
    default:
      break;
  }
};

document.addEventListener('keyup', handleMoveInputKeyUp);


const handleAttackInputKeyDown = input => {
  if (input.keyCode === 17) {
    inputStatusObj[input.keyCode] = true;
    // player.startAttack();
  }
};
document.addEventListener('keydown', handleAttackInputKeyDown);

const handleAttackInputKeyUp = input => {
  if (input.keyCode === 17) {
    inputStatusObj[input.keyCode] = false;
    // player.startAttack();
  }
};
document.addEventListener('keyup', handleAttackInputKeyUp);

function update(runtime) {
  requestId = undefined;
  loopControl.clear();

  if (runtime < lastFrameTimeMs + 1000 / maxFPS) {
    loopControl.start();
    return;
  }

  // track the accumulated time that hasn't been rendered yet
  delta += runtime - lastFrameTimeMs;
  lastFrameTimeMs = runtime;
  // render the total elapsed time in fixed-size chunks
  let numUpdateSteps = 0;
  while (delta >= timestep) {
    // move here

    rules.createEnemy(runtime, frequencyInMs, boss.posX, boss.posY);

    const moveAndDrawEnemies = () => {
      rules.enemyArr.forEach( e => {
        e.move(timestep);
        e.draw();
      } )
    }
    moveAndDrawEnemies();
    // box.move(timestep);
    // box.draw();
    // box2.move(timestep);
    // box2.draw();
    // box3.move(timestep);
    // box3.draw();

    updatePlayerMovement(timestep);
    player.draw();
    boss.draw();

    if (player.isAttacking) {
      player.drawAttackHitbox();
      if (rules.isHitGiven()) {
        victoryToken = true;
      }
      // TODO: this method creates a stack of setTimeOut and delays the next user input.
      setTimeout(() => player.stopAttack(), 500);
    }

    if (rules.isGameover()) {
      gameOverToken = true;
    }

    if (victoryToken) {
      console.log('victory');
      loopControl.stop();
    } else if (gameOverToken) {
      console.log('game over!');
      loopControl.stop();
    } else {
      loopControl.start();
    }

    delta -= timestep;
    // sanity check
    if (++numUpdateSteps >= 240) {
      delta = 0; // fix things
      break; // bail out;
    }
  }
  // end
}

gameSetup.build();

loopControl.start();

// setTimeout(loopControl.clear, 3000);