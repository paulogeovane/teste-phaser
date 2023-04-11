import Spell from 'spell';
class IceCage extends Spell {

  constructor(game, x, y, key, cooldown, duration) {
    super(game, x, y, key, cooldown, duration);
  }

  create() {
    // the ice cage spells spawn 3 ice cages
    for(var i = 0; i < 3; i++) {
      let ice = this.game.add.sprite(0, 0, 'ice');
      ice.anchor.set(0.5);

      // add the animations in
      let summon = ice.animations.add('summon', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]);
      ice.animations.add('idle', [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
      ice.animations.add('shatter', [48, 49, 50, 51, 52, 53, 54]);

      // when the summon completes
      // we play the idle animation
      summon.onComplete.add(() => {
          ice.play('idle', this.game.rnd.between(5, 10), true);
      });

      this.group.push(ice);
    }
  }

  perform() {
    this.group.forEach((ice) => {
      // pick a random target
      let target = this.game.rnd.pick(this.zombies.filter(function(e) { return e.alive; }));

      // flag it so we don't pick it out from the list again
      target.alive = false;

      // store a reference, we need to access it later on
      ice.target = target;

      // spawn the ice on the target's position
      // offset a bit so it appears below the target
      ice.x = target.x;
      ice.y = target.y + 20;

      // random size, revive and play the animation
      ice.scale.set(this.game.rnd.realInRange(0.5, 0.8));
      ice.alpha = 1;
      ice.revive();
      ice.play('summon', 25, false);

      // freeze the target after a few ms after the lightning plays
      this.game.time.events.add(300, () => {
        // tween the target to blue
        this.tweenTint(target, 0xffffff, 0x0000aa, 500);
        // and stop it's animation
        target.animations.paused = true;
      });
    });
  }

  expire() {
    this.group.forEach((ice) => {
      // after the spell expires, we play the shatter animation
      ice.play('shatter', 15, false, true);

      // can be re-targeted
      ice.target.alive = true;

      // tween the target back to its original color
      this.tweenTint(ice.target, 0x0000aa, 0xffffff, 500);

      // resume target's animation
      ice.target.animations.paused = false;
    });
  }

  tweenTint(obj, startColor, endColor, time) {
    // create an object to tween with our step value at 0
    var colorBlend = {step: 0};

    // create the tween on this object and tween its step property to 100
    var colorTween = this.game.add.tween(colorBlend).to({step: 100}, time);

    // run the interpolateColor function every time the tween updates, feeding it the
    // updated value of our tween each time, and set the result as our tint
    colorTween.onUpdateCallback(function() {
        obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
    });

    // set the object to the start color straight away
    obj.tint = startColor;

    // start the tween
    colorTween.start();
  }
}
export default IceCage;
