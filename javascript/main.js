let requestId;

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

// check for positions and status from everything in canvas.
const rules = {
  enemyArr: [],
  // TODO: check if any enemy is hit by attack array. check if it is a boss.
  attackArr: [],
  createBoss() {
    const boss = new Enemy(
      canvas.context,
      80,
      80,
      canvas.element.width - 200,
      canvas.element.height - 200,
      'yellow'
    );
    this.enemyArr.push(boss);
    return boss;
  },
  // create instances of components
  createEnemy() {
    // at the moment there is no difference between boss and enemies.
  },
  isGameover() {
    const isPlayerHit = this.enemyArr.some(e => {
      return player.isHit(e);
    });
    console.log('is player hit? ', isPlayerHit);
    return isPlayerHit;
    // console.log(loopControl.stop())
  },
  // check boss colision against player with active status (or something like that)
  isVictory() {}
};

/* calls */
gameSetup.build();
loopControl.start();

const boss = rules.createBoss();

const player = new Player(
  canvas.context,
  40,
  40,
  450,
  canvas.element.height - 250,
  'red'
);

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
    player.attack();
  }
};

document.addEventListener('keydown', handleMoveInput);
document.addEventListener('keydown', handleAttackInput);


/* MAIN GAME LOOP */
function update() {
  requestId = undefined;
  loopControl.clear();
  // start
  boss.draw();
  player.draw();
  // checa isAttacking? desliga eventListener de input e retorna uma funcao. Essa funcao recebe um array de funcoes e retorna uma delas. Essa funcao manipula o jogador, hitbox, etc...
  if (rules.isGameover()) {
    console.log('game over!');
    loopControl.stop();
  } else {
    loopControl.start();
  }
  // end
}

// setTimeout(loopControl.clear, 3000);
setTimeout(loopControl.stop, 20000);
