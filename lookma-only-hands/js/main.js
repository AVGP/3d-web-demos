var Leap  = require('leapjs'),
    LeapPlugins = require('leapjs-plugins'),
    World = require('three-world');

alert("Ready");

World.init({camDistance: 600});

World.start();
World.getCamera().position.y = 50;
Leap.loop(function(frame){
}).use('boneHand', { scene: World.getScene() });
