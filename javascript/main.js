/* global var */

let requestId;
let lastFrameTimeMs = 0;
let maxFPS = 61; // update this value to control maxFPS
let delta = 0; // elapsed time since last update.
let timestep = 1000 / 60; // update the denominator to control maxFPS

/* end of global var */

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
// check for positions and status from everything in canvas.
const rules = {
  // this array holds all the checks to che
  enemyArr: [],
  // TODO: check if any enemy is hit by attack array. check if it is a boss.
  attackArr: [],
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
      return player.isHit(e);
    });
    // console.log('is player hit? ', isPlayerHit);
    return isPlayerHit;
    // console.log(loopControl.stop())
  },
  // check boss colision against player with active status (or something like that)
  isVictory() {}
};

/* calls */
const boss = rules.createBoss();

const player = new Player(
  canvas.context,
  40,
  40,
  450,
  canvas.element.height - 100,
  'red'
);

const box2 = new Enemy(canvas.context, 50, 50, 150, 250, 'red');
const box = new Enemy(canvas.context, 50, 50, 100, 200, 'pink');
const box3 = new Enemy(canvas.context, 50, 50, 50, 150, 'yellow');

// LOOP CONTROL AND UPDATE FUNCION
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

    console.log('player.isAttacking?', player.isAttacking)

    // isPlayerAttacking = ;

    if(player.isAttacking) {
      console.log('XXXXXXXXXXX')
      player.drawAttackHitbox();
      setTimeout( () => player.stopAttacking(), 1000);
    }

    delta -= timestep;
    // sanity check
    if (++numUpdateSteps >= 240) {
      delta = 0; // fix things
      break; // bail out;
    }
  }

  // TODO: checa isAttacking? desliga eventListener de input e retorna uma funcao. Essa funcao recebe um array de funcoes e retorna uma delas. Essa funcao manipula o jogador, hitbox, etc...
  if (rules.isGameover()) {
    console.log('game over!');
    loopControl.stop();
  } else {
    loopControl.start(runtime);
  }
  // end
}

gameSetup.build();

loopControl.start();

// setTimeout(loopControl.clear, 3000);
// setTimeout(loopControl.stop, 5000);
