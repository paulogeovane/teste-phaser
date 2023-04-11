import 'babel-polyfill';
import DemoState from 'demo';
class Game extends Phaser.Game {
  constructor() {
    var body = document.body,
      html = document.documentElement;
    var height = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    var width = Math.max(body.scrollWidth, body.offsetWidth,
      html.clientWidth, html.scrollWidth, html.offsetWidth);

    super(width, height, Phaser.AUTO, 'test', null, true, false);
  }
}


const game = new Game();
game.state.add('DemoState', DemoState, false);
game.state.start('DemoState');

var myModal = new bootstrap.Modal(document.getElementById('modalCoverExample'), {
  keyboard: false
})

$('#new_scene').on('click', function () {
  window.location.reload();
})


document.body.oncontextmenu = function preventRightClick(e) {
  e.preventDefault();
};
