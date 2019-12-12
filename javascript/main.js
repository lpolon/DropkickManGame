const element = document.getElementById('canvas');
const context = document.getElementById('canvas').getContext('2d');

element.width = 720;
element.height = 620;

let requestId;
let lastFrameTimeMs = 0;
const maxFPS = 61; // update this value to control maxFPS
let delta = 0; // elapsed time since last update.
const timestep = 1000 / 60; // update the denominator to control maxFPS

let victoryToken;
let gameOverToken;

let startAttackTimestamp;
let attackFrameCounter = 0;
let playerStartPosY; // isJumpingFlag
let playerJumpMaxHeight = 110;

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
  createPlatform(w, h, width) {
    const floor = new Component(
      context,
      w,
      h - 20,
      width,
      20,
      '#5142f5'
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
      element.width
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
        30,
        30,
        'pink',
        element.width
      );
      this.allCompArr.push(enemy);
      this.enemyArr.push(enemy);
      return enemy;
    }
  },

  createPlayer() {
    const player = new Player(context, 10, 10, 40, 40, 'red', element.width);
    this.allCompArr.push(player);
    return player;
  },

  gravity(deltaValue) {
    this.allCompArr.forEach(e => {
      if (e.isHitTaken(this.floorArr[0])) {
        if (e.posY === this.floorArr[0].posY - e.height) {
          e.velocityY = 0;
        } else {
          e.posY = this.floorArr[0].posY - e.height;
        }
      } else {
        e.fall(deltaValue);
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
      }
    });
  },
  isVictory() {
    return player.isHitGiven(boss);
  }
};

const floor = rules.createPlatform(
  0,
  element.height,
  element.width,
  );
  const floor2 = rules.createPlatform(
    // element.width / 1.5 - 1,
    0,
    element.height - 80,
    element.width,
  )
const boss = rules.createBoss();
const player = rules.createPlayer();
// *** INPUTS ***

const inputStatusObj = {
  17: [false, 0],
  37: [false, 0],
  38: [false, 0],
  39: [false, 0]
};

const updateJumpInput = deltaValue => {
  if (inputStatusObj[38][0]) {
    helper.stopJumpInputListening();
    console.log('jump!');
    if (!playerStartPosY) {
      playerStartPosY = player.posY;
    }
    player.jump(deltaValue);
  } else {
    playerStartPosY = undefined;
  }
};

const updatePlayerMovement = deltaValue => {
  if (inputStatusObj[37][0] && inputStatusObj[39][0]) {
    if (inputStatusObj[37][1] > inputStatusObj[39][1]) {
      if(!inputStatusObj[38][0]) {
        player.goLeft(deltaValue);
      } else {
        player.goLeftWhileJumping(deltaValue);
      }
    } else {
      if (!inputStatusObj[38][0]) {
        player.goRight(deltaValue);
      } else {
        player.goRightWhileJumping(deltaValue);
      }
    }
  }
  if (inputStatusObj[37][0]) {
    if(!inputStatusObj[38][0]) {
      player.goLeft(deltaValue);
    } else {
      player.goLeftWhileJumping(deltaValue)
    }
  }
  if (inputStatusObj[39][0]) {
    if(!inputStatusObj[38][0]) {
      player.goRight(deltaValue);
    } else {
      player.goRightWhileJumping(deltaValue);

    }
  }
};
// TODO make player.jump() happen
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

const handleJumpInputKeyDown = input => {
  if (input.keyCode === 38) {
    inputStatusObj[input.keyCode] = [true, new Date().getTime()];
  }
};
document.addEventListener('keydown', handleJumpInputKeyDown);

const handleJumpInputKeyUp = input => {
  if (input.keyCode === 38) {
    inputStatusObj[input.keyCode] = [false, new Date().getTime()];
  }
};
document.addEventListener('keyup', handleJumpInputKeyUp);

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
    floor2.draw();
    if (player.velocityY === 0) {
      helper.resumeJumpInputListening();
    }
    console.log(player.posY);
    if (player.posY < playerStartPosY - playerJumpMaxHeight) {
      inputStatusObj[38][0] = false;
    }
    updateJumpInput(timestep);
    updatePlayerMovement(timestep);
    rules.createEnemy(runtime, frequencyInMs, boss.posX, boss.posY);
    rules.gravity(timestep);
    rules.moveAndDrawEnemies();
    player.draw();
    boss.draw();

    if (player.isAttacking) {
      helper.stopInputs();
      if (!startAttackTimestamp) {
        startAttackTimestamp = runtime;
      }
      const attackDuration = 850;
      const endAttackTimeStamp = startAttackTimestamp + attackDuration;

      if (runtime < endAttackTimeStamp) {
        attackFrameCounter += 1;
        console.log(attackFrameCounter);
        console.log('i am attack!');
        player.drawAttackHitbox();
        // TODO: attack frames here
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
