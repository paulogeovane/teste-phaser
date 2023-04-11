import Spell from 'spell';

class MagicBolt extends Spell {
  constructor(game, x, y, key, cooldown, duration) {
    super(game, x, y, key, cooldown, duration);
  }
  create() {
    // we create an actual Phaser.Group
    // because we want these sprites to
    // be on top of all the zombies
    this.boltGroup = this.game.add.group();

    // create 3 magic bolts
    for(var i = 0; i < 3; i++) {
      let bolt = this.game.add.sprite(0, 0, 'bolt');
      // add the animations in
      // one for moving and another when it hits their targets
      bolt.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      bolt.animations.add('sizzle', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
      bolt.scale.set(0.6);
      bolt.anchor.set(0.5);
      // don't show the bolts
      bolt.kill();
      bolt.SPEED = 400; // speed pixels/second
      bolt.TURN_RATE = 5; // turn rate in degrees/frame

      // enable physics because we'removing this sprite using velocity
      this.game.physics.enable(bolt, Phaser.Physics.ARCADE);

      this.group.push(bolt)
      this.boltGroup.add(bolt);
    }
  }
  perform() {
    this.group.forEach((bolt) => {
      // pick a random zombie to target
      let target = this.game.rnd.pick(this.zombies.filter(function(e) { return e.alive; }));
      // flag it so it doesn't get pick again
      target.alive = false;

      // random properties for each bolt
      bolt.revive();
      bolt.scale.set(0.6);
      bolt.play('move', 40, true);
      // make it come out from the player's sword
      bolt.x = this.player.x + 50;
      bolt.y = this.player.y - 30;

      // store a reference so we can access it later on
      bolt.target = target;

      // to start with, I want the bolts to randomly fly
      // towards the top of the game screen
      let startX = this.game.rnd.between(this.player.x, this.player.y + 100);
      let startY = this.game.rnd.between(0, 50);

      // set a fix speed regardless of the bolt's distance from their targets
      let duration = (this.game.math.distance(startX, startY, bolt.x, bolt.y) / bolt.SPEED) * 1000;

      // make the bolt face the target
      var targetAngle = this.game.math.angleBetween(
          bolt.x, bolt.y,
          startX, startY
        );
      bolt.rotation = targetAngle;

      // tween the bolt
      let tween = this.game.add.tween(bolt).to({ x: startX, y: startY }, duration, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(() => {
        // once the bolt reaches the top of the game screen
        // we start making it home in to their target
        bolt.homeIn = true;
      });
    })
  }

  update() {
    // we want our bolts to be on top of their targets
    this.game.world.bringToTop(this.boltGroup);

    this.group.forEach((bolt) => {
      if(bolt.homeIn) {
        var targetAngle = this.game.math.angleBetween(
            bolt.x, bolt.y,
            bolt.target.x, bolt.target.y
        );
		    // Gradually (this.TURN_RATE) aim the missile towards the target angle
        if (bolt.rotation !== targetAngle) {
          // Calculate difference between the current angle and targetAngle
          var delta = targetAngle - bolt.rotation;

          // Keep it in range from -180 to 180 to make the most efficient turns.
          if (delta > Math.PI) delta -= Math.PI * 2;
          if (delta < -Math.PI) delta += Math.PI * 2;

          if (delta > 0) {
              // Turn clockwise
              bolt.angle += bolt.TURN_RATE;
          } else {
              // Turn counter-clockwise
              bolt.angle -= bolt.TURN_RATE;
          }

          // Just set angle to target angle if they are close
          if (Math.abs(delta) < this.game.math.degToRad(bolt.TURN_RATE)) {
              bolt.rotation = targetAngle;
          }
        }
        // Calculate velocity vector based on this.rotation and this.SPEED
        bolt.body.velocity.x = Math.cos(bolt.rotation) * bolt.SPEED;
        bolt.body.velocity.y = Math.sin(bolt.rotation) * bolt.SPEED;

        // distance check if it hits the target
        if(this.game.math.distance(bolt.x, bolt.y, bolt.target.x, bolt.target.y) < 20) {
            // play the hit animation
            bolt.target.play('die', this.game.rnd.between(9, 15), false);
            bolt.target.revive();

            // stop the bolt from moving
            bolt.homeIn = false;
            bolt.body.velocity.x = 0;
            bolt.body.velocity.y = 0;

            // show the hit animation with random size
            let size = this.game.rnd.realInRange(0.7, 1);
            bolt.scale.set(size);
            bolt.play('sizzle', 25, false, true);
        }
      }
    });
  }
}

export default MagicBolt;
