import GameState from "gameState";
import MagicBolt from "magicbolt";
import FireWall from "firewall";
import LightningBolt from "lightningbolt";
import IceCage from "icecage";
import FireStorm from "firestorm";
import Player from "player";
import Tornado from "tornado";
class DemoState extends GameState {
  preload() {
    super.preload();

    this.game.load.image("bg", "assets/bg/background2.png");
    this.game.load.image("burnMark", "assets/spells/burnmark.png");
    this.game.load.image("groundCrack", "assets/spells/groundcrack.png");

    this.game.load.image("iconMagicBolt", "assets/icons/fireball-eerie-2.png");
    this.game.load.image("iconFireWall", "assets/icons/Wall of Fire.png");
    this.game.load.image("iconTornado", "assets/icons/tornado.png");
    this.game.load.image("iconLightningBolt", "assets/icons/Thunder.png");
    this.game.load.image("iconIceCage", "assets/icons/Blizzard.png");
    this.game.load.image("iconFireStorm", "assets/icons/fire-arrows-3.png");

    this.game.load.atlas(
      "player",
      "assets/knight/atlas.png",
      "assets/knight/atlas.json"
    );
    this.game.load.atlas(
      "zombie1",
      "assets/zombie1/atlas.png",
      "assets/zombie1/atlas.json"
    );

    this.game.load.atlas(
      "bolt",
      "assets/spells/bolt/atlas.png",
      "assets/spells/bolt/atlas.json"
    );
    this.game.load.atlas(
      "flame",
      "assets/spells/fire/atlas.png",
      "assets/spells/fire/atlas.json"
    );
    this.game.load.atlas(
      "ice",
      "assets/spells/ice/atlas.png",
      "assets/spells/ice/atlas.json"
    );
    this.game.load.atlas(
      "tornado",
      "assets/spells/tornado/atlas.png",
      "assets/spells/tornado/atlas.json"
    );
  }
  create() {
    this.game.juicy = this.game.plugins.add(new Phaser.Plugin.Juicy(this));

    let bgGroup = this.game.add.group();
    let bg = this.game.add.sprite(0, 20, "bg");
    bg.anchor.setTo(0, 0);
    bg.scale.set(0.3);
    bgGroup.add(bg);

    this.player = new Player(this.game, 80, 200, "player");

    this.zombies = [];
    var offsetX = 120;
    var offsetY = 110;
    for (let y = 1; y < 4; y++) {
      for (let x = 1; x < 5; x++) {
        let posx = x * 100 + (y % 2 ? 0 : 50) + offsetX;
        let posy = y * 50 + offsetY;
        this.createZombie(posx, posy);
      }
    }

    // icon position, icon key, cooldown, duration
    let magicBolt = new MagicBolt(this.game, 50, 430, "iconMagicBolt", 2500);
    let fireWall = new FireWall(
      this.game,
      130,
      430,
      "iconFireWall",
      5000,
      3000
    );
    let lightningBolt = new LightningBolt(
      this.game,
      210,
      430,
      "iconLightningBolt",
      2000
    );
    let iceCage = new IceCage(this.game, 290, 430, "iconIceCage", 3000, 2000);
    let fireStorm = new FireStorm(this.game, 370, 430, "iconFireStorm", 6000);
    let tornado = new Tornado(this.game, 450, 430, "iconTornado", 3000, 2000);

    // store a reference for these because we need to call their update method
    this.magicBolt = magicBolt;
    this.fireStorm = fireStorm;

    // we need a reference to the player's position
    magicBolt.player = this.player;

    // passagem da variavel zombies para os spells
    iceCage.zombies = this.zombies;
    magicBolt.zombies = [this.zombies[0], this.zombies[1], this.zombies[2]]; // aqui é definido qual a posição dos zombies
    lightningBolt.zombies = this.zombies;
    tornado.zombies = [this.zombies[0], this.zombies[1], this.zombies[2]];

    // create keyboard and touch inputs
    this.game.input.addPointer();
    this.enableInput(magicBolt, Phaser.KeyCode.ONE);
    this.enableInput(fireWall, Phaser.KeyCode.TWO);
    this.enableInput(lightningBolt, Phaser.KeyCode.THREE);
    this.enableInput(iceCage, Phaser.KeyCode.FOUR);
    this.enableInput(fireStorm, Phaser.KeyCode.FIVE);
    this.enableInput(tornado, Phaser.KeyCode.SIX);
  }

  enableInput(spell, keycode) {
    this.game.input.keyboard.addKey(keycode).onDown.add(() => {
      this.castSpell(spell);
    });

    spell.icon.inputEnabled = true;
    spell.icon.events.onInputDown.add((icon) => {
      this.castSpell(spell);
    });
  }

  castSpell(spell) {
    if (spell.active) {
      this.player.play("attack", 20, false);
      // only cast the spell after a certain ms the animation plays
      this.game.time.events.add(300, () => {
        spell.cast();
      });
    }
  }

  createZombie(x, y) {
    let zombie = this.game.add.sprite(x, y, "zombie1");
    zombie.anchor.setTo(0.5, 0.5);

    var idle = zombie.animations.add(
      "idle",
      [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
    );
    var die = zombie.animations.add(
      "die",
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    );
    var raise = zombie.animations.add(
      "raise",
      [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    );
    zombie.play("raise", 10, false);
    zombie.scale.setTo(-0.4, 0.4);
    // everytime a zombie dies, we raise them back
    die.onComplete.add(() => {
      zombie.play("raise", this.game.rnd.between(15, 20), false);
    });
    // set them to idle after they have risen
    // the random play speed gives us a nice effect
    // so that their movements are not sync with each other
    raise.onComplete.add(() => {
      zombie.play("idle", this.game.rnd.between(9, 20), true);
    });

    // store in our regular array
    this.zombies.push(zombie);
  }

  update() {
    this.game.world.sort("y", Phaser.Group.SORT_ASCENDING);

    this.magicBolt.update();
    this.fireStorm.update();
  }

  render() {
    super.render();

    this.game.debug.text("Press 1 - magic bolt", 600, 400);
    this.game.debug.text("2 - fire wall", 630, 416);
    this.game.debug.text("3 - lightning bolt", 630, 432);
    this.game.debug.text("4 - ice cage", 630, 448);
    this.game.debug.text("5 - fire storm", 630, 464);
    this.game.debug.text("6 - tornado", 630, 480);
  }
}
export default DemoState;
