import Spell from 'spell';

class LightningBolt extends Spell {
    constructor(game, x, y, key, cooldown, duration) {
        super(game, x, y, key, cooldown, duration);
    }
    create() {
        let lightningBolt = this.game.add.sprite(0, 0, 'bolt');
        let animation = lightningBolt.animations.add('move', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
        lightningBolt.scale.setTo(1.5, 1);
        lightningBolt.anchor.setTo(0.5, 0.5);
        lightningBolt.kill();

        animation.onComplete.add(() => {
          lightningBolt.target.tint = 0xffffff;
          lightningBolt.target.play('die', this.game.rnd.between(9, 15), false);
        });

        // create the ground crack decal
        // once again, we add this to its own group so it doesn't get affected
        // when we are sorting the world and this shows always below the zombie
        let groundCrackGroup = this.game.add.group();
        let groundCrack = this.game.add.sprite(0, 0, 'groundCrack');
        groundCrack.scale.set(0.2);
        groundCrack.anchor.setTo(0.5, 0.5);
        groundCrack.alpha = 0;
        groundCrackGroup.add(groundCrack);

        lightningBolt.crack = groundCrack;

        // there's a single instance of this so we don't need the array
        this.lightningBolt = lightningBolt;
    }
    perform() {
      // find a random zombie that is alive to target
      let zombie = this.game.rnd.pick(this.zombies.filter(function(e) { return e.alive; }));

      let lightningBolt = this.lightningBolt;
      lightningBolt.revive();
      lightningBolt.target = zombie;
      // a little variety where the starting position of the lightning
      lightningBolt.x = zombie.x + this.game.rnd.between(-20, 20);
      // just making sure it's on top of the zombie's head
      lightningBolt.y = zombie.y - (lightningBolt.height / 2) + 20; // offset

      // find the target angle to the zombie so the lightning's end is pointing at the zombie's position
      var targetAngle = this.game.math.angleBetween(
          lightningBolt.x, lightningBolt.y,
          zombie.x, zombie.y
      );
      lightningBolt.rotation = targetAngle;

      // play the animation
      lightningBolt.play('move', 20, false, true);

      // and make sure it stays on top
      this.game.world.bringToTop(lightningBolt);

      // add some effect after the bolts hit the zombie
      this.game.time.events.add(150, () => {
        // show a crack on the ground
        lightningBolt.crack.angle = this.game.rnd.between(0, 360);
        lightningBolt.crack.alpha = 1;
        lightningBolt.crack.position.set(zombie.x, zombie.y + 30);
        // fade out the crack
        this.game.add.tween(lightningBolt.crack).to({alpha: 0}, 1000);

        // blacken the zombie to show our zombie got fried from the bolt
        zombie.tint = 0x555555;
        // shake and flash the zombie
        this.game.add.tween(zombie).to({x: lightningBolt.x - 10}, 50, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
        this.game.add.tween(zombie).to({alpha: 0.2 }, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
      });
    }
}

export default LightningBolt;
