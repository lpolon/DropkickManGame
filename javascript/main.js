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
  },
};

// global variables
let requestId;
let lastFrameTimeMs = 0;
const maxFPS = 61; // update this value to control maxFPS
let delta = 0; // elapsed time since last update.
const timestep = 1000 / 60; // update the denominator to control maxFPS

let victoryToken;
let gameOverToken;

// controller of game rules
const rules = {
  enemyArr: [],
  // TODO: check if any enemy is hit by attack array. check if it is a boss.
  createBoss() {
    const boss = new Enemy(
      canvas.context,
      80,
      80,
      canvas.element.width - 100,
      canvas.element.height - 100,
      'yellow'
    );
    this.enemyArr.push(boss);
    return boss;
  },
  // create instances of components
  createEnemy() {
  },
  isGameover() {
    const isPlayerHit = this.enemyArr.some(e => {
      return player.isHitTaken(e);
    });
    return isPlayerHit;
  },
  // TODO: boss is been treated as any other enemy.
  isVictory() {
    const isEnemyHit = this.enemyArr.some(e => {
      return player.isHitGiven(e);
    });
    return isEnemyHit;
  }
};

// TODO: instanciation should be handled by rules
const boss = rules.createBoss();

const player = new Player(
  canvas.context,
  40,
  40,
  450,
  canvas.element.height - 100,
  'red',
);

const box2 = new Enemy(canvas.context, 50, 50, 150, 250, 'red');
const box = new Enemy(canvas.context, 50, 50, 100, 200, 'pink');
const box3 = new Enemy(canvas.context, 50, 50, 50, 150, 'yellow');


// *** INPUTS ***
const handleMoveInput = input => {
  switch (input.keyCode) {
    case 37:
      player.goLeft();
      break;
    case 38:
      player.goTop();
      break;
    case 39:
      player.goRight();
      break;
    case 40:
      player.gotBot();
      break;
    default:
      break;
  }
};

const handleAttackInput = input => {
  if (input.keyCode === 32) {
    player.startAttack();
  }
};

document.addEventListener('keydown', handleMoveInput);
document.addEventListener('keydown', handleAttackInput);

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
  var numUpdateSteps = 0;
  while (delta >= timestep) {

    // move here
    box.move(timestep);
    box.draw();
    box2.move(timestep);
    box2.draw();
    box3.move(timestep);
    box3.draw();
    player.draw();
    boss.draw();


    if(player.isAttacking) {
      player.drawAttackHitbox();
      if (rules.isVictory()) {
        victoryToken = true;
      }
      // TODO: this method creates a stack of setTimeOut and delays the next user input.
      setTimeout( () => player.stopAttack(), 500);
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
// setTimeout(loopControl.stop, 5000);