import Main from './main.js';

var canvas = document.getElementById('game-container');
var game = new Main(canvas);
game.loadAssets();
canvas.addEventListener('click', (e) => {
    if (!game.gameStarted) game.startGame(e);
});