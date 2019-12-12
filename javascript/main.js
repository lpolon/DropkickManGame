const element = document.getElementById('canvas');
const context = document.getElementById('canvas').getContext('2d');

element.width = 720;
element.height = 400;

let requestId;
let lastFrameTimeMs = 0;
const maxFPS = 61; // update this value to control maxFPS
let delta = 0; // elapsed time since last update.
const timestep = 1000 / 60; // update the denominator to control maxFPS

let victoryToken;
let gameOverToken;

let startAttackTimestamp;
let attackFrameCounter = 0;


let frequencyInMs = 2000;

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
    context.clearRect(0, 0, element.width, element.height);
  }
};

// controller of game rules
const rules = {
  enemyArr: [],
  allCompArr: [],
  floorArr: [],
  createPlatform() {
    const floor = new Component(
      context,
      0,
      element.height - 40,
      element.width,
      40,
      '#5142f5',
    );
    this.floorArr.push(floor);
    return floor;
  },

  createBoss() {
    const boss = new Enemy(
      context,
      element.width - 100,
      element.height - 120,
      80,
      80,
      '#f58742',
      true,
      element.width,
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
    if (
      Math.floor(parseInt(runtime, 10)) % frequencyInMs >
      frequencyInMs - 17
    ) {
      // console.log('create enemy! ', runtime);
      const enemy = new Enemy(
        context,
        bossPositionX - 50,
        bossPositionY,
        40,
        40,
        'pink',
        element.width,
      );
      this.allCompArr.push(enemy);
      this.enemyArr.push(enemy);
      return enemy;
    }
  },

  createPlayer() {
    const player = new Player(
      context,
      10,
      10,
      40,
      40,
      'red',
      element.width,
    );
    this.allCompArr.push(player);
    return player;
  },

  gravity(deltaValue) {
    this.allCompArr.forEach((e) => { 
      if (e.isHitTaken(this.floorArr[0])) {
        e.posY = this.floorArr[0].posY - e.height;
      } else {
        e.fall(deltaValue) 
      }
    });
  },

  moveAndDrawEnemies() {
    this.enemyArr.forEach(e => {
      e.draw();
      e.move(timestep);
    });
  },

  isGameover() {
    const isPlayerHitByEnemy = this.enemyArr.some(e => {
      return player.isHitTaken(e);
    });
    const isPlayerHitByBoss = player.isHitTaken(boss);
    return isPlayerHitByEnemy || isPlayerHitByBoss;
  },
  isHitGivenOnEnemy() {
    this.enemyArr.forEach((e, i) => {
      if (player.isHitGiven(e)) {
        this.enemyArr.splice(i, 1);
      };
    });
  },
  isVictory() {
    return player.isHitGiven(boss);
  }
};

const floor = rules.createPlatform();
const boss = rules.createBoss();
const player = rules.createPlayer();
// *** INPUTS ***

const inputStatusObj = {
  17: [false, 0],
  37: [false, 0],
  39: [false, 0]
};

const updatePlayerMovement = deltaValue => {
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
};

const playerAttack = () => {
  
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
    player.startAttack();
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
    // do everything here:
    floor.draw();
    updatePlayerMovement(timestep);
    player.draw();
    boss.draw();
    rules.createEnemy(runtime, frequencyInMs, boss.posX, boss.posY);

    rules.moveAndDrawEnemies();

    rules.gravity(timestep);
    
    if (player.isAttacking) {
      helper.stopInputs();
      // holds timestamp of startAttack
      if (!startAttackTimestamp) {
        startAttackTimestamp = runtime;
      }
      // startAttackTimestamp.push(runtime);
      const attackDuration = 1000;
      const endAttackTimeStamp = startAttackTimestamp + attackDuration;
      
      if (runtime < endAttackTimeStamp) {
        attackFrameCounter += 1;
        console.log(attackFrameCounter);
        console.log('i am attack!')
        player.drawAttackHitbox() // attack function.
      } else {
        player.stopAttack();
        helper.resumeInput();
        startAttackTimestamp = undefined;
        attackFrameCounter = 0;
      }
      if (rules.isVictory()) {
        victoryToken = true;
      }
      rules.isHitGivenOnEnemy();

      // resume inputs

      // setTimeout(() => player.stopAttack(), 500);
      // setTimeout( () => helper.resumeInput(), 500);
      // startAttackTimestamp = undefined;
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
loopControl.start();
console.log(player.horizontalLimit);