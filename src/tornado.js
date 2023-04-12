import Spell from "spell";
class Tornado extends Spell {
  constructor(game, x, y, key, cooldown, duration) {
    super(game, x, y, key, cooldown, duration);
  }

  create() {
    for (var i = 0; i < 3; i++) {
      let tornado = this.game.add.sprite(0, 0, "tornado");
      tornado.anchor.set(0.5);

      let summon = tornado.animations.add("summon", [1, 2, 3, 4, 5, 6, 7, 8]);
      tornado.animations.add("shatter", [9, 10, 11, 12, 13, 14, 15, 16, 17]);

      summon.onComplete.add(() => {
        tornado.play("idle", this.game.rnd.between(5, 10), true);
      });

      this.group.push(tornado);
    }
  }

  perform() {
    this.group.forEach((tornado) => {
      let target = this.game.rnd.pick(
        this.zombies.filter(function (e) {
          return e.alive;
        })
      );

      target.alive = false;

      tornado.target = target;

      tornado.x = target.x;
      tornado.y = target.y + 20;

      tornado.scale.set(this.game.rnd.realInRange(0.5, 0.8));
      tornado.alpha = 1;
      tornado.revive();
      tornado.play("summon", 25, false);

      this.game.time.events.add(300, () => {
        this.tweenTint(target, 0xffffff, 0x00ff00, 500);
        target.animations.paused = true;
      });
    });
  }

  expire() {
    this.group.forEach((tornado) => {
      tornado.play("shatter", 15, false, true);

      tornado.target.alive = true;

      this.tweenTint(tornado.target, 0x00ff00, 0xffffff, 500);

      tornado.target.animations.paused = false;
    });
  }

  tweenTint(obj, startColor, endColor, time) {
    var colorBlend = { step: 0 };

    var colorTween = this.game.add.tween(colorBlend).to({ step: 100 }, time);

    colorTween.onUpdateCallback(function () {
      obj.tint = Phaser.Color.interpolateColor(
        startColor,
        endColor,
        100,
        colorBlend.step
      );
    });

    obj.tint = startColor;

    colorTween.start();
  }
}
export default Tornado;
