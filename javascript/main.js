const element = document.getElementById('canvas');
const context = document.getElementById('canvas').getContext('2d');

element.width = 720;
element.height = 600;

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

const randomFrequency = helper.generateRandomNumberInArr(1500, 4000);

const frequencyInMs = randomFrequency;

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
  bossArr: [],

  createPlatform(w, h, width) {
    const floor = new Component(context, w, h - 20, width, 20, '#5142f5');
    this.floorArr.push(floor);
    return floor;
  },

  createBoss(w, h, width, height, color, isFinalBoss) {
    const aBoss = new Enemy(
      context,
      w,
      h,
      width,
      height,
      color,
      isFinalBoss,
    );
    this.allCompArr.push(aBoss);
    this.bossArr.push(aBoss);
    return aBoss;
  },
  // create instances of components
  createEnemy(runtime, frequencyInMs, bossPositionX, bossPositionY) {
    if (
      Math.floor(parseInt(runtime, 10)) % frequencyInMs >
      frequencyInMs - 17
    ) {
      const enemy = new Enemy(
        context,
        bossPositionX,
        bossPositionY,
        30,
        30,
        'yellow',
      );
      this.allCompArr.push(enemy);
      this.enemyArr.push(enemy);
      return enemy;
    }
  },

  createPlayer() {
    const player = new Player(
      context,
      120,
      430,
      40,
      48,
      'red',
      element.width,
      );
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
      } else if (e.isHitTaken(this.floorArr[1])) {
        if (e.posY === this.floorArr[1].posY - e.height) {
          e.velocityY = 0;
        } else {
          e.posY = this.floorArr[1].posY - e.height;
        }
      } else if (e.isHitTaken(this.floorArr[2])) {
        if (e.posY === this.floorArr[2].posY - e.height) {
          e.velocityY = 0;
        } else {
          e.posY = this.floorArr[2].posY - e.height;
        }
      } else if (e.isHitTaken(this.floorArr[3])) {
        if (e.posY === this.floorArr[3].posY - e.height) {
          e.velocityY = 0;
        } else {
          e.posY = this.floorArr[3].posY - e.height;
        }
      } else if (e.isHitTaken(this.floorArr[4])) {
        if (e.posY === this.floorArr[4].posY - e.height) {
          e.velocityY = 0;
        } else {
          e.posY = this.floorArr[4].posY - e.height;
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
    const isPlayerHitByBoss = this.bossArr.some(e => {
      return player.isHitTaken(e);
    });
    const isPlayerHitByFinalBoss = player.isHitTaken(boss2);
    return isPlayerHitByEnemy || isPlayerHitByBoss || isPlayerHitByFinalBoss;
  },

  isHitGivenOnEnemy() {
    this.enemyArr.forEach((e, i) => {
      if (player.isHitGiven(e)) {
        this.enemyArr.splice(i, 1);
      }
    });
    this.bossArr.forEach((e, i) => {
      if (player.isHitGiven(e)) {
        // console.log(this.bossArr.splice(i, 1))
        // this.bossArr.splice(i, 1);
        e.posX = 10000; // splice just didn't work
      }
    });
  },

  isVictory() {
    return player.isHitGiven(boss2);
  },
};

const floor0 = rules.createPlatform(
  0,
  element.height,
  element.width);

const floor1 = rules.createPlatform(
  element.width / 1.5 - 1,
  element.height - 80,
  element.width
);

const floor2 = rules.createPlatform(
  0,
  element.height - 190,
  element.width / 2,
);

const floor3 = rules.createPlatform(
  element.width / 1.8,
  element.height - 320,
  element.width / 3
);

const floor4 = rules.createPlatform(
  0,
  element.height - 450,
  element.width / 2.2
);

const boss0 = rules.createBoss(
  element.width - 100,
  element.height - 120,
  60,
  60,
  '#f58742',
  false,
);

const boss1 = rules.createBoss(
  80,
  element.height - 350,
  60,
  60,
  '#f58742',
  false,
)

const boss2 = rules.createBoss(
  60,
  element.height - 500,
  80,
  80,
  'crimson',
  true,
)

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
    // TODO stop listening to jumps
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
      if (!inputStatusObj[38][0]) {
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
    if (!inputStatusObj[38][0]) {
      player.goLeft(deltaValue);
    } else {
      player.goLeftWhileJumping(deltaValue);
    }
  }
  if (inputStatusObj[39][0]) {
    if (!inputStatusObj[38][0]) {
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

    floor0.draw();
    floor1.draw();
    floor2.draw();
    floor3.draw();
    floor4.draw();
    if (player.velocityY === 0) {
      helper.resumeJumpInputListening();
    }
    if (player.posY < playerStartPosY - playerJumpMaxHeight) {
      inputStatusObj[38][0] = false;
    }
    updateJumpInput(timestep);
    updatePlayerMovement(timestep);

    rules.createEnemy(runtime, frequencyInMs, boss0.posX, boss0.posY);
    rules.createEnemy(runtime, frequencyInMs, boss1.posX, boss1.posY);
    rules.createEnemy(runtime, frequencyInMs, boss2.posX, boss2.posY);

    rules.gravity(timestep);
    rules.moveAndDrawEnemies();
    boss0.draw();
    boss1.draw();
    boss2.draw();
    boss2.bigbossMove();
    player.draw();

    if (player.isAttacking) {
      helper.stopInputs();
      if (!startAttackTimestamp) {
        startAttackTimestamp = runtime;
      }
      const attackDuration = 850;
      const endAttackTimeStamp = startAttackTimestamp + attackDuration;

      if (runtime < endAttackTimeStamp) {
        console.log(attackFrameCounter);
        attackFrameCounter += 1;
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