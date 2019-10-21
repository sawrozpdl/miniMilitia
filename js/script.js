import Main from '/js/Main.js';

var canvas = document.getElementById('game-container');

var game = new Main(canvas, 1366, 768);

game.loadAssets();