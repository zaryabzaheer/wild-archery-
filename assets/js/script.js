var letsPlay = false;
var letsPause = false;
var letsRestart = false;
var isGamePaused = false;
var isScoreAdded = false;
var trajectoryCheck = false;
var isGravity = true;
var count = 0;
let score = 0;
let keys = false;
var scale = 2;
let responsive = false;
let isScale = true;
let trajectory = 2;
let isBonus = 2;
let isGetBonus = true;
let disableTrajectory = true;
var isCollide = false;
var maxCount = 50;
var progressBar = document.getElementById("progressbar");
var track = document.getElementById("track");
var controlBtn = document.getElementById("play-pause");
var bow_inner_joint = document.getElementById("#bow_inner_joint");
var bow = document.getElementById("#bow");
playBtn = document.getElementById("play_btn");
shootBtn = document.getElementById("shoot_btn");
var arrowSpeed = 1 * 40;
var music;
var groundBlock;
var groundBlockOne;
var groundBlockTwo;
var groundBlockThree;
var groundBlockFourth;
let isDraw = false;
var maxArrowRelease = 0;
var startheight = 100;
var height = 300;
var t = 0;
var f = 5;
var musicArrow;
var musicBoard;
var musicGameOver;
var isClicking = false;
var swipeDirection;
var _currentFill = "#f00";
$(document).ready(function () {
  document.getElementById("result").innerHTML = score;
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  let keys = {
    space: false,
    up: false,
    down: false
  };

  onkeydown = onkeyup = function (e) {
    e = e || event;
    if (e.keyCode == 32) keys.space = e.type == 'keydown';
    if (e.keyCode == 38) keys.up = e.type == 'keydown';
    if (e.keyCode == 40) keys.down = e.type == 'keydown';
  }

  let timer = setInterval(() => {
    if (keys.space == true) {
      speedManager();
    }
  }, 20);

  function speedManager() {
    console.log("calll")
    const setCountZeor = () => {
      count = 0;
      count = count === maxCount ? maxCount : count;
      //target progressbar width and increase it
      var newWidth = (count / maxCount) * 100 + "%";
      progressBar.style.width = newWidth;
    };
    // increase count if it's less than maxCount
    if (!letsPause) {
      if (count < 50) {
        arrowSpeed = count * 40;
        count = count === maxCount ? maxCount : count + 1;
        //target progressbar width and increase it
        var newWidth = (count / maxCount) * 100 + "%";
        progressBar.style.width = newWidth;

        arrowSpeed = count * 40;
      } else {
        setCountZeor();
      }
    }
  }
  $("#shoot_btn").hide()
  if (screen.width <= 700) {
    if (!responsive) {
      playBtn.addEventListener('click', e => {
        $("#play_btn").hide();
        setInterval(() => {
          speedManager();
          $("#progressbar").css("display", "block");
          $("#shoot_btn").show()
        }, 30);
      });
    }
    responsive = true;
  }

  window.addEventListener("keydown", function (e) {
    $("#progressbar").css("display", "block")
  });

  window.addEventListener("keyup", function (e) {
    if (letsPause) {
      gamePausedReminder();
    }
    count = 0;
    count = count === maxCount ? maxCount : count;
    var newWidth = (count / maxCount) * 100 + "%";
    progressBar.style.width = newWidth
    // keycode 32
    var event = window.event ? window.event : e;
    if (event.keyCode == 32) {
      letsPlay = true;

      setTimeout(() => {
        if (!letsPause) {
          if (!isCollide) {
            let untouch = `MISS!`;
            document.getElementById("result_message").innerHTML = untouch;
          }
        }
      }, 2000);

      setTimeout(() => {
        groundBlock.scale.setTo(1);
        groundBlockOne.scale.setTo(1);
        groundBlockTwo.scale.setTo(1);
        groundBlockThree.scale.setTo(1);
        groundBlockFourth.scale.setTo(1);
        isDraw = false;
        isScale = true;
        disableTrajectory = true;
        isGetBonus = true;
        document.getElementById("result_message").innerHTML = "";
      }, 3000);
    }
  });

  // Target Board function call on window Load
  $(window).on("load", function () {
    isGamePaused = false;
    playPause(isGamePaused);
  });
  // when pause mode is on then we have to stop arrow + arrow movement +music+ decrements of heart
  document.getElementById("kill_game").onclick = function () {
    letsPause = true;
    isGamePaused = true;
    playPause(isGamePaused);
    swal(
      {
        title: "Game Paused",
        imageUrl: "assets/images/Dart.svg",
        text: "Press enter to resume game",
        showCancelButton: false,
        confirmButtonColor: "#58b4e6",
        confirmButtonText: "Resume",
        html: true,
        className: "swal-back",
      },
      function (isConfirm) {
        if (isConfirm) {
          letsPause = false;
        }
      }
    );
  };
  // Restart Game
  document.getElementById("restart_game").addEventListener("click", function () {
    letsPause = false;
    swal({
      title: "Restart Game ?",
      text: "Try Again",
      imageUrl: "assets/images/image_2022_03_15T13_19_04_764Z.png",
      imageWidth: 550,
      imageHeight: 225,
      imageAlt: "BullEyes",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#58b4e6",
      cancelButtonColor: "#999999",
      reverseButtons: false,
    }, function (isConfirm) {
      if (isConfirm) {
        letsRestart = true;
      }
    }

    );
  });

  document.getElementById("bonus").addEventListener("click", (event) => {
    if (!letsPause) {
      if (isGetBonus) {
        getBonus();
      }
      isGetBonus = false;
    }
  });

  function loader() {
    const percentValue = document.querySelector(".percent-value");
    var percent = 0;
    var loop = setInterval(() => {
      if (percent != 100) {
        percent++;
        percentValue.innerText = percent;
      } else {
        clearInterval(loop);
      }
    }, 38);
  }
  loader();

  $("#play-pause").click(function () {
    isGamePaused = false;
    playPause(isGamePaused);
  });

  function playPause() {
    if (!isGamePaused) {
      if (track.paused) {

        track.play();
        controlBtn.className = "pause";
        $("#custom_mute").hide();

      } else {
        track.pause();
        controlBtn.className = "play";
        $("#custom_mute").show();
      }
    }

  }

  document.getElementById('custom_mute').addEventListener("click", playPause);

  track.addEventListener("ended", function () {
    controlBtn.className = "play";
  });

});


function my2() {
  score = 0;
  letsPause = false;
  isCollide = false;
  letsRestart = true;
  maxArrowRelease = 0;
}

function redraw(c) {
  var cc = c.getContext("2d");
  if (cc) {
    c.width = c.clientWidth;
    c.height = c.clientHeight;
    cc.scale(c.width, c.height);
    // Draw a circle filling the canvas.
    cc.beginPath();
    cc.arc(0.5, 0.5, 0.5, 0, 2 * Math.PI);
    cc.fill();
  }
}

// phaser matter.js Trajectory
// A GAME MECHANIC EXPLORER DEMO
var GameState = function (game) { };
// Load images and sounds
GameState.prototype.preload = function () {
  this.game.load.image("bullet", "./assets/images/Arrow.png");
  this.load.image("bowbase", "./assets/images/body.png");
  this.load.image("bow", "./assets/images/bow.png");
  this.load.image("background", "./assets/images/background.png");
  this.game.load.image("ground", "assets/images/01-Base with stand.svg");
  this.game.load.image("groundOne", "assets/images/02-Gray Circle.svg");
  this.game.load.image("groundTwo", "assets/images/03-Blue Circle.svg");
  this.game.load.image("groundThree", "assets/images/04-Red Circle.svg");
  this.game.load.image("groundFourth", "assets/images/05-Yellow Circle.svg");
  this.game.load.spritesheet('explosion', 'assets/images/explosion.png', 128, 128);
  game.load.audio('boden_1', ['assets/music/arrow-weap.mp3']);
  game.load.audio('boden_2', ['assets/music/touch-sound.mp3']);
  game.load.audio('boden_3', ['assets/music/game-over.mp3']);

};

function render() {
  game.debug.cameraInfo(game.camera, 32, 32);
}

GameState.prototype.create = function () {
  myimage = this.add.image(0, 0, "background");
  bowbase = this.add.image(160, this.game.height - 260, "bowbase");
  bow = this.add.image(179, this.game.height - 310, "bow");
  bow.anchor.setTo(0.65, 0.5);
  this.physics.enable(bow);
  bowbase.anchor.setTo(0.5);
  myimage.scale.setTo(0.3, 0.3);
  music = game.sound.play("boden");
  musicArrow = game.add.audio('boden_1');
  musicBoard = game.add.audio('boden_2');
  musicGameOver = game.add.audio('boden_3');
  // Define constants
  this.SHOT_DELAY = 300; // milliseconds (10 bullets/3 seconds)
  this.BULLET_SPEED = arrowSpeed; // pixels/second
  this.NUMBER_OF_BULLETS = 50;
  if (isGravity) {
    this.GRAVITY = 980; // pixels/second/second
  }

  // Create an object representing our gun
  this.gun = this.add.image(175, this.game.height - 340, "bullet");
  this.gun.rotation = 100;
  //this.gun.scale.setTo(0.5,0.5);
  // Set the pivot point to the center of the gun
  this.gun.anchor.setTo(0.5);
  $("#target_size").click(function (event) {
    if (!letsPause) {
      if (isScale) {
        if (scale > 0) {
          scale--;
          document.getElementById("number_of_scale").innerHTML = scale;
          groundBlock.scale.setTo(1.4);
          groundBlockOne.scale.setTo(1.4);
          groundBlockTwo.scale.setTo(1.4);
          groundBlockThree.scale.setTo(1.4);
          groundBlockFourth.scale.setTo(1.4);
          if (scale == 0) {
            $("#number_of_scale").css("fill", "red");
          }
        }
      }
      isScale = false;
    }
  });
  // Create some ground
  // first target
  this.ground = this.game.add.group();
  // Add the ground blocks, enable physics on each, make them immovable
  groundBlock = this.game.add.sprite(1000, this.game.height - 432, "ground");
  this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
  groundBlock.body.immovable = true;
  groundBlock.body.allowGravity = false;
  groundBlock.body.setSize(0, 0, 20, 20);
  this.ground.add(groundBlock);
  //  second target
  this.groundOne = this.game.add.group();
  // Add the ground blocks, enable physics on each, make them immovable
  groundBlockOne = this.game.add.sprite(
    1000,
    this.game.height - 432,
    "groundOne"
  );
  this.game.physics.enable(groundBlockOne, Phaser.Physics.ARCADE);
  groundBlockOne.body.immovable = true;
  groundBlockOne.body.allowGravity = false;
  groundBlockOne.body.setSize(0, 0, 30, 30);
  this.groundOne.add(groundBlockOne);
  //  third target
  this.groundTwo = this.game.add.group();
  // Add the ground blocks, enable physics on each, make them immovable
  groundBlockTwo = this.game.add.sprite(
    1000,
    this.game.height - 432,
    "groundTwo"
  );
  this.game.physics.enable(groundBlockTwo, Phaser.Physics.ARCADE);
  groundBlockTwo.body.immovable = true;
  groundBlockTwo.body.allowGravity = false;
  groundBlockTwo.body.setSize(0, 0, 40, 40);
  this.groundTwo.add(groundBlockTwo);
  //  fourth target
  this.groundThree = this.game.add.group();
  // Add the ground blocks, enable physics on each, make them immovable
  groundBlockThree = this.game.add.sprite(
    1000,
    this.game.height - 432,
    "groundThree"
  );
  this.game.physics.enable(groundBlockThree, Phaser.Physics.ARCADE);
  groundBlockThree.body.immovable = true;
  groundBlockThree.body.allowGravity = false;
  groundBlockThree.body.setSize(0, 0, 60, 60);
  this.groundThree.add(groundBlockThree);
  //  fifth target
  this.groundFourth = this.game.add.group();
  // Add the ground blocks, enable physics on each, make them immovable
  groundBlockFourth = this.game.add.sprite(
    1000,
    this.game.height - 432,
    "groundFourth"
  );
  this.game.physics.enable(groundBlockFourth, Phaser.Physics.ARCADE);
  groundBlockFourth.body.immovable = true;
  groundBlockFourth.body.allowGravity = false;
  groundBlockFourth.body.setSize(50, 50, 70, 70);
  this.groundThree.add(groundBlockFourth);
  // Create an object pool of bullets
  this.bulletPool = this.game.add.group();
  for (var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
    // Create each bullet and add it to the group.
    var bullet = this.game.add.sprite(0, 0, "bullet");
    this.bulletPool.add(bullet);
    // Set its pivot point to the center of the bullet
    bullet.anchor.setTo(1, 0.5);
    // Enable physics on the bullet
    this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.body.immovable = false;
    bullet.body.allowGravity = true;
    // bullet.body.setSize(0, 40, 40, 70);
    // Set its initial state to "dead".
    bullet.kill();
  }
  // Turn on gravity
  game.physics.arcade.gravity.y = this.GRAVITY;
  // Create a group for explosions
  this.explosionGroup = this.game.add.group();
  // Setup a canvas to draw the trajectory on the screen
  this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
  this.game.add.image(-4, 0, this.bitmap);
  this.bitmap.context.fillStyle = "rgb(255, 255, 255)";
  this.bitmap.context.strokeStyle = "rgb(255, 255, 255)";
  // Simulate a pointer click/tap input at the center of the stage
  // when the example begins running.
  this.game.input.activePointer.x = this.game.width / 2;
  this.game.input.activePointer.y = this.game.height / 2 - 200;
};

GameState.prototype.drawTrajectory = function () {

  if (trajectoryCheck) {
    this.bitmap.context.fillStyle = "rgb(255, 255, 255)";
    this.bitmap.context.strokeStyle = "rgb(255, 255, 255)";
    trajectoryCheck = false;
  }

  // Clear the bitmap
  this.bitmap.context.clearRect(0, 0, this.game.width, this.game.height);
  // Set fill style to white
  // Calculate a time offset. This offset is used to alter the starting
  // time of the draw loop so that the dots are offset a little bit each
  // frame. It gives the trajectory a "marching ants" style animation.
  var MARCH_SPEED = 40; // Smaller is faster
  this.timeOffset = this.timeOffset + 20 || 0;
  this.timeOffset = this.timeOffset % MARCH_SPEED;
  // Just a variable to make the trajectory match the actual track a little better.
  // The mismatch is probably due to rounding or the physics engine making approximations.
  var correctionFactor = 0.99;
  var theta = -this.gun.rotation;
  var x = 0,
    y = 0;
  for (
    var t = 0 + this.timeOffset / ((1000 * MARCH_SPEED) / 60);
    t < 3;
    t += 0.03
  ) {
    x = this.BULLET_SPEED * t * Math.cos(theta) * correctionFactor;
    y =
      this.BULLET_SPEED * t * Math.sin(theta) * correctionFactor -
      0.5 * this.GRAVITY * t * t;
    this.bitmap.context.fillRect(x + this.gun.x, this.gun.y - y, 3, 3);
    if (y < -15) break;
  }
  this.bitmap.dirty = true;
};

// document.addEventListener("mousemove", () => {
//   let mousex = event.clientX; // Gets Mouse X
//   let mousey = event.clientY; // Gets Mouse Y
// });

GameState.prototype.shootBullet = function () {
  // Enforce a short delay between shots by recording
  // the time that each bullet is shot and testing if
  // the amount of time since the last shot is more than
  // the required delay.
  if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
  if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
  this.lastBulletShotAt = this.game.time.now;
  // Get a dead bullet from the pool
  var bullet = this.bulletPool.getFirstDead();
  // If there aren't any bullets available then don't shoot
  if (bullet === null || bullet === undefined) return;
  // Revive the bullet
  // This makes the bullet "alive"
  bullet.revive();
  // Bullets should kill themselves when they leave the world.
  // Phaser takes care of this for me by setting this flag
  // but you can do it yourself by killing the bullet if
  // its x,y coordinates are outside of the world.
  bullet.checkWorldBounds = false;
  bullet.outOfBoundsKill = false;
  // Set the bullet position to the gun position.
  bullet.reset(this.gun.x, this.gun.y);
  bullet.rotation = this.gun.rotation;
  // Shoot it in the right direction
  bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
  bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
};

function result() {
  score += 6;
  textBox = document.getElementById("result").innerHTML = "";
  textBox = document.getElementById("result").innerHTML = score;
  textBox.value = score;
  let touchOne = `Not Bad` + '<br>' + `6 Points`;
  document.getElementById("result_message").innerHTML = touchOne;
}

function resultOne() {
  score += 7;
  textBox = document.getElementById("result").innerHTML = "";
  textBox = document.getElementById("result").innerHTML = score;
  textBox.value = score;
  let touchOne = `Fair` + '<br>' + `7 Points`;;
  document.getElementById("result_message").innerHTML = touchOne;
}

function resultTwo() {
  score += 8;
  textBox = document.getElementById("result").innerHTML = "";
  textBox = document.getElementById("result").innerHTML = score;
  textBox.value = score;
  let touchTwo = `Good` + '<br>' + `8 Points`;;
  document.getElementById("result_message").innerHTML = touchTwo;
}

function resultThree() {
  score += 9;
  textBox = document.getElementById("result").innerHTML = "";
  textBox = document.getElementById("result").innerHTML = score;
  textBox.value = score;
  let touchThree = `Excellent` + '<br>' + `9 Points`;;
  document.getElementById("result_message").innerHTML = touchThree;
}

function resultFour() {
  score += 10;
  textBox = document.getElementById("result").innerHTML = "";
  textBox = document.getElementById("result").innerHTML = score;
  textBox.value = score;
  let touchFourth = `Perfect` + '<br>' + `10 Points`;;
  document.getElementById("result_message").innerHTML = touchFourth;
}

function getBonus() {
  if (isBonus > 0) {
    score++;
    isBonus--;
    document.getElementById("numbers_of_bonus").innerHTML = isBonus;
    if (isBonus == 0) {
      $("#numbers_of_bonus").css("fill", "red");
    }
  }
}

$("#make_trajectory").on("click", function () {
  setTimeout(() => {
    if (!letsPause) {
      if (disableTrajectory) {
        if (trajectory > 0) {
          trajectoryCheck = true;
          isDraw = true;
          trajectory--;
          document.getElementById("numbers_of_trajectory").innerHTML = trajectory;

          if (trajectory == 0) {
            $("#numbers_of_trajectory").css("fill", "red");
            disableTrajectory = false;
          }
        }
      }
    }
  }, 2000);
});

// The update() method is called every frame
GameState.prototype.update = function () {
  if (isDraw) {
    this.drawTrajectory();
  }
  //maximum value of up 0.5685925138830504
  if (!letsPause) {
    if (screen.width <= 700) {
      if (responsive) {
        document.addEventListener("mousemove", (e) => {
          let middlehalf = window.innerHeight / 2;
          if (e.clientY < 260) {
            if (e.clientY > middlehalf && (this.gun.rotation <= 0.20207337096424222)) {
              console.log(e.clientY, middlehalf)
              this.gun.angle += 0.006;
              bow.angle += 0.006;
            }
          }

          if (e.clientY <= middlehalf && (this.gun.rotation > -0.932390642832072)) {
            this.gun.angle -= 0.006;
            bow.angle -= 0.006;
          }
        });
      }

    }

    if ((this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && (this.gun.rotation <= 0.20207337096424222))) {
      this.gun.angle += 0.8;
      bow.angle += 0.8;
    }
  }
  // minimum value of down -1.106923568031506
  if (!letsPause) {
    if ((this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && (this.gun.rotation > -0.932390642832072))) {
      this.gun.angle -= 0.8;
      bow.angle -= 0.8;
    }
  }

  let c = document.querySelector("canvas");
  if (c) {
    redraw(c);
  }

  this.BULLET_SPEED = arrowSpeed;
  if (this.game.time.fps !== 0) {
    this.fpsText.setText(this.game.time.fps + " FPS");
  }

  // Check if bullets have collided with the ground
  this.game.physics.arcade.collide(
    this.bulletPool,
    this.ground,
    async function (bullet, ground) {
      isCollide = await true;
      setTimeout(() => {
        if (!isScoreAdded) {
          result();
          isScoreAdded = true;
        }
      }, 1000);
      // Create an explosion
      this.getExplosion(bullet.x, bullet.y);
      musicBoard.play();
      // groundBlock.scale.setTo(0);
      // Kill the bullet
      // this.gun.body.immovable = false;
      // this.gun.body.allowGravity = false;
      isGravity = false;
      bullet.kill();
    },
    null,
    this
  );
  this.game.physics.arcade.collide(
    this.bulletPool,
    this.groundOne,
    async function (bullet, groundOne) {
      isCollide = await true;
      setTimeout(() => {
        if (!isScoreAdded) {
          resultOne();
          isScoreAdded = true;
        }
      }, 1000);
      // Create an explosion
      this.getExplosion(bullet.x, bullet.y);
      musicBoard.play();
      // groundBlock.scale.setTo(0);
      // Kill the bullet
      // this.gun.body.immovable = false;
      // this.gun.body.allowGravity = false;
      isGravity = false;
      bullet.kill();
    },
    null,
    this
  );
  this.game.physics.arcade.collide(
    this.bulletPool,
    this.groundTwo,
    async function (bullet, groundTwo) {
      isCollide = await true;
      setTimeout(() => {
        if (!isScoreAdded) {
          resultTwo();
          isScoreAdded = true;
        }
      }, 1000);
      // Create an explosion
      this.getExplosion(bullet.x, bullet.y);
      musicBoard.play();
      // groundBlock.scale.setTo(0);
      // Kill the bullet
      // this.gun.body.immovable = false;
      // this.gun.body.allowGravity = false;
      isGravity = false;
      bullet.kill();
      return
    },
    null,
    this
  );
  this.game.physics.arcade.collide(
    this.bulletPool,
    this.groundThree,
    async function (bullet, groundThree) {
      isCollide = await true;
      setTimeout(() => {
        if (!isScoreAdded) {
          resultThree();
          isScoreAdded = true;
        }
      }, 1000);
      // Create an explosion
      this.getExplosion(bullet.x, bullet.y);
      musicBoard.play();
      // groundBlock.scale.setTo(0);
      // Kill the bullet
      // this.gun.body.immovable = false;
      // this.gun.body.allowGravity = false;
      // isGravity = false;return
      bullet.kill();
    },
    null,
    this
  );
  this.game.physics.arcade.collide(
    this.bulletPool,
    this.groundFourth,
    async function (bullet, groundFourth) {
      isCollide = await true;
      setTimeout(() => {
        if (!isScoreAdded) {
          resultFour();
          isScoreAdded = true;
        }
      }, 1000);

      // Create an explosion
      this.getExplosion(bullet.x, bullet.y);
      musicBoard.play();
      // groundBlock.scale.setTo(0);
      // Kill the bullet
      // this.gun.body.immovable = false;
      // this.gun.body.allowGravity = false;
      // isGravity = false;return
      bullet.kill();
    },
    null,
    this
  );
  // Rotate all living bullets to match their trajectory
  this.bulletPool.forEachAlive(function (bullet) {
    bullet.rotation = Math.atan2(
      bullet.body.velocity.y,
      bullet.body.velocity.x
    );
  }, this);

  // if (this.game.input.activePointer.isDown) {
  //   this.shootBullet();
  // }
  $("#shoot_btn").click(function () {
    if (letsPlay) {
      this.shootBullet
      setTimeout(() => {
        if (!letsPause) {
          if (!isCollide) {
            let untouch = `MISS!`;
            document.getElementById("result_message").innerHTML = untouch;
          }
        }
      }, 2000);
    }
    letsPlay = true;
    setTimeout(() => {
      document.getElementById("result_message").innerHTML = "";
    }, 3000);
  })

  // Set the pivot point to the center of the gun
  // // Aim the gun at the pointer.
  // // All this function does is calculate the angle using
  // Math.atan2(yPointer-yGun, xPointer-xGun)
  // this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);
  // bow.rotation = this.game.physics.arcade.angleToPointer(bow);
  if (letsPlay) {
    musicArrow.play();
    //set the play flag
    letsPlay = false;
    isGetBonus = true;
    this.bitmap.context.fillStyle = "transparent";
    this.bitmap.context.strokeStyle = "transparent";
    //shoot the arrow here
    if (!letsPause) {
      this.shootBullet();
    }
    //heart Values Decrement here
    if (!letsPause) {
      setTimeout(() => {
        if (!isCollide) {
          ++maxArrowRelease;
          for (i = 0; i < 5; i++) {
            setTimeout(() => {
              if (groundBlock.x < 1195) {
                groundBlock.x += 7;
                groundBlock.y = height * Math.abs(Math.sin(groundBlock.y / 1)) + startheight;
                groundBlockOne.x += 7;
                groundBlockOne.y = height * Math.abs(Math.sin(groundBlockOne.y / 1)) + startheight;
                groundBlockTwo.x += 7;
                groundBlockTwo.y = height * Math.abs(Math.sin(groundBlockTwo.y / 1)) + startheight;
                groundBlockThree.x += 7;
                groundBlockThree.y = height * Math.abs(Math.sin(groundBlockThree.y / 1)) + startheight;
                groundBlockFourth.x += 7;
                groundBlockFourth.y = height * Math.abs(Math.sin(groundBlockFourth.y / 1)) + startheight;
              }

            }, 500);
            let heart = document.getElementById(`heart${i}`);
            let notColored = 5 - maxArrowRelease; //4
            if (i + 1 > notColored) $(heart).css("fill", "#222222");
          }
        } else {
          if (groundBlock.x < 1195) {
            groundBlock.x += 7;
            groundBlock.y = height * Math.abs(Math.sin(groundBlock.y / 1)) + startheight;
            groundBlockOne.x += 7;
            groundBlockOne.y = height * Math.abs(Math.sin(groundBlockOne.y / 1)) + startheight;
            groundBlockTwo.x += 7;
            groundBlockTwo.y = height * Math.abs(Math.sin(groundBlockTwo.y / 1)) + startheight;
            groundBlockThree.x += 7;
            groundBlockThree.y = height * Math.abs(Math.sin(groundBlockThree.y / 1)) + startheight;
            groundBlockFourth.x += 7;
            groundBlockFourth.y = height * Math.abs(Math.sin(groundBlockFourth.y / 1)) + startheight;
          }
        }
      }, 2000);
      isScoreAdded = false;
      isCollide = false;
    }
    //game Done or not
    setTimeout(() => {
      if (maxArrowRelease >= 5) {
        // groundBlock.x+=10;
        // groundBlock.y = height*Math.abs(Math.sin(groundBlock.y/5))+startheight;
        setTimeout(() => {
          document.getElementById("result").innerHTML = "";
          musicGameOver.play();
          swal(
            {
              title: "GAME OVER",
              text: `Your Score is ${score}`,
              imageUrl: "assets/images/dart.svg",
              showCancelButton: true,
              confirmButtonColor: "#58b4e6",
              cancelButtonColor: "#58b4e6",
              confirmButtonText: "Play Again",
              cancelButtonText: "Quit Game",
              closeOnConfirm: true,
              closeOnCancel: true,
            },
            function (isConfirm) {
              if (isConfirm) {
                my2();
              }
            }
          );
        }, 100);

        return;
      }
    }, 3000);
  }
  if (letsRestart) {
    //reset flag
    letsRestart = false;
    for (i = 0; i < 5; i++) {
      if (groundBlock.x > 800) {
        groundBlock.x -= 10;
        groundBlock.y = height * Math.abs(Math.sin(groundBlock.y / 5)) + startheight;
        groundBlockOne.x -= 10;
        groundBlockOne.y = height * Math.abs(Math.sin(groundBlockOne.y / 5)) + startheight;
        groundBlockTwo.x -= 10;
        groundBlockTwo.y = height * Math.abs(Math.sin(groundBlockTwo.y / 5)) + startheight;
        groundBlockThree.x -= 10;
        groundBlockThree.y = height * Math.abs(Math.sin(groundBlockThree.y / 5)) + startheight;
        groundBlockFourth.x -= 10;
        groundBlockFourth.y = height * Math.abs(Math.sin(groundBlockFourth.y / 5)) + startheight;
      }
      let heart = document.getElementById(`heart${i}`);
      $(heart).css("fill", "#fc3b32");
    }
    scale = 2;
    document.getElementById("number_of_scale").innerHTML = scale;
    if (scale == 2) {
      $("#number_of_scale").css("fill", "#58b4e6");
    }
    trajectory = 2;
    document.getElementById("numbers_of_trajectory").innerHTML = trajectory;
    if (trajectory == 2) {
      $("#numbers_of_trajectory").css("fill", "#58b4e6");
    }
    isBonus = 2;
    document.getElementById("numbers_of_bonus").innerHTML = isBonus;
    if (isBonus == 2) {
      $("#numbers_of_bonus").css("fill", "#58b4e6");
    }
    score = 0;
    textBox = document.getElementById("result").innerHTML = score;
  }
  // }
};

GameState.prototype.getExplosion = function (x, y) {
  // Get the first dead explosion from the explosionGroup
  var explosion = this.explosionGroup.getFirstDead();

  // If there aren't any available, create a new one
  if (explosion === null) {

    explosion = this.game.add.sprite(0, 0, 'explosion');
    explosion.anchor.setTo(0.5, 0.5);

    // Add an animation for the explosion that kills the sprite when the
    // animation is complete
    var animation = explosion.animations.add('boom', [0, 1, 2, 3], 60, false);
    animation.killOnComplete = true;

    // Add the explosion sprite to the group
    this.explosionGroup.add(explosion);
  }

  // Revive the explosion (set it's alive property to true)
  // You can also define a onRevived event handler in your explosion objects
  // to do stuff when they are revived.
  explosion.revive();

  // Move the explosion to the given coordinates
  explosion.x = x;
  explosion.y = y;

  // Set rotation of the explosion at random for a little variety
  explosion.angle = this.game.rnd.integerInRange(100, 360);

  // Play the animation
  explosion.animations.play('boom');

  // Return the explosion itself in case we want to do anything else with it
  return explosion;
};


var game = new Phaser.Game(1380, 663, Phaser.AUTO, "phaser-example");
game.state.add("game", GameState, true);
window.focus();
// Loader Area
$("#phaser-example").hide(2).delay(1000).show(0);
$(".circle").show(3).delay(1000).hide(0);

