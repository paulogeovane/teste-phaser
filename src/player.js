class Player {
  constructor(game, x, y, key) {
    // just some common setup to show our hero
    let player = game.add.sprite(x, y, key);
    player.animations.add('idle', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    let attack = player.animations.add('attack', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    player.play('idle', 12, true);
    attack.onComplete.add(() => {
        player.play('idle', game.rnd.between(15, 20), false);
    });

    player.anchor.setTo(0.5, 0.5);
    player.scale.set(0.4);

    return player;
  }
}

export default Player;
