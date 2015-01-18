var Leap  = require('leapjs'),
    LeapPlugins = require('leapjs-plugins'),
    World = require('three-world'),
    THREE = require('three');

alert("Ready");

World.init({camDistance: 600});

World.start();
World.getCamera().position.y = 50;
Leap.loop(function(frame){
}).use('boneHand', {
    scene: World.getScene(),
    jointColor: new THREE.Color(0x00ff00),
    arm: true
});
