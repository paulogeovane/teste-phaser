class State extends Phaser.State {
  preload() {
    this.load.onLoadStart.add(this.loadStart, this);
    this.load.onFileComplete.add(this.fileComplete, this);
    this.load.onLoadComplete.add(this.loadComplete, this);
  }

  loadStart() {
    this.loadingText = this.add.text(20, this.world.height - 32, 'Loading...', { font: '20px Arial', fill: '#ffffff' });
  }

  fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    this.loadingText.setText('File Complete: ' + progress + '% - ' + totalLoaded + ' out of ' + totalFiles);
  }

  loadComplete() {
    this.game.world.remove(this.loadingText);

    this.time.advancedTiming = true;
  }

  create() {
    this.showDebug = false;
    this.game.input.keyboard.addKey(Phaser.KeyCode.D).onDown.add(() => {
      this.showDebug = !this.showDebug;
    });

    this.game.camera.x = this.game.world.centerX - this.game.width / 2;
  }

  createKeyboardMovement() {
    this.keyboardCursors = this.game.input.keyboard.createCursorKeys();
    this.moveSpeed = { x: 0, y: 0 }

    this.wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
  }

  createVirtualGamepad() {
    // create virtual gamepad
    let gamepad = this.game.plugins.add(Phaser.Plugin.VirtualGamepad)
    this.joystick = gamepad.addJoystick(60, this.game.height - 60, 0.5, 'gamepad');

    // plugin wants the creation of a button
    // but there is no usage for it here so i'm just going to hide it
    this.gamepadbutton = gamepad.addButton(this.game.width - 60, this.game.height - 60, 0.5, 'gamepad');
    this.gamepadbutton.visible = false;
  }

  goingLeft() {
    return this.keyboardCursors.left.isDown || this.wasd.left.isDown || (this.joystick && this.joystick.properties.left);
  }

  goingRight() {
    return this.keyboardCursors.right.isDown || this.wasd.right.isDown || (this.joystick && this.joystick.properties.right);
  }

  update() {
  }

  render() {
    this.game.debug.text(this.game.time.fps, 5, 14, '#00ff00')
  }

  loadSpriter(key) {
    if(!this.spriterLoader) this.spriterLoader = new Spriter.Loader();

    let spriterFile = new Spriter.SpriterXml(this.game.cache.getXML(key + 'Animations'));

    // process loaded xml/json and create internal Spriter objects - these data can be used repeatly for many instances of the same animation
    let spriter = this.spriterLoader.load(spriterFile);

    return new Spriter.SpriterGroup(game, spriter, key, key);
  }

  drawIsoGrid() {
    let isoGrid = new IsoGrid(game);
    isoGrid.drawGrid();
  }
}
export default State;
