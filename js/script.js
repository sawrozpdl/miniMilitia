import Main from '/js/Main.js';

var canvas = document.getElementById('game-container');

var game = new Main(canvas, 960, 640);

game.launch();