import MiniMilitia from '/js/MiniMilitia.js';

var canvas = document.getElementById('game-container');

var miniMilitia = new MiniMilitia(canvas, 960, 640);

miniMilitia.launch();