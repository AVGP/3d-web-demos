var THREE = require('three'),
    World = require('three-world'),
    Ocean = require('./ocean'),
    OBJMTLLoader = require('./vendor/OBJMTLLoader'),
    VREffect = require('./vendor/VREffect'),
    Audio  = require('./audio'),
    FlyCtrl = require('./vendor/FlyControls');

var isVRmode = false;

// Auxilliary functions

var clock = new THREE.Clock();

function fullscreen(e) {
  if (e.target.requestFullscreen) {
    e.target.requestFullscreen();
  } else if (e.target.msRequestFullscreen) {
    e.target.msRequestFullscreen();
  } else if (e.target.mozRequestFullScreen) {
    e.target.mozRequestFullScreen();
  } else if (e.target.webkitRequestFullscreen) {
    e.target.webkitRequestFullscreen();
  }

  var width  = window.innerWidth,
      height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  World.getRenderer().setSize(width, height);
  if(isVRmode) VR.setSize(width, height);
}

function deg2rad(angle) {
  return (angle / 180.0) * Math.PI;
}

function updateOrientation(e) {
  if(!isVRmode) return;

  var heading = e.alpha,
      pitch   = e.gamma;

  // Correcting the sensors being "clever"
  if(Math.abs(e.beta) > 45) {
    heading += 90;
  } else {
    heading -= 90;
  }

  if(pitch < 0) {
    pitch = -90 - pitch;
  } else {
    pitch =  90 - pitch;
  }

  if(heading < 0) heading = 360 + heading;

  camera.rotation.set(deg2rad(pitch), deg2rad(heading), 0);
}

// Go!

var sfx = new Audio();

World.init({
  clearColor: 0x47a5ba,
  rendUntitled4ererOpts: { antialias: true },
  renderCallback: function() {
    ocean.update();
    controls.update(clock.getDelta());
    if(isVRmode) {
      VR.render(World.getScene(), camera);
      return false;
    }
    return true;
  }
});

var ocean = Ocean(World.getRenderer(), World.getCamera(), World.getScene(), "img/waternormals.jpg", "img/sky2.jpg");
World.add(ocean);

var camera = World.getCamera();
camera.position.set(0, 10, 20);
camera.rotation.order = 'YXZ';

var controls = new FlyCtrl( camera );
controls.movementSpeed = 100;
controls.domElement = document.querySelector("canvas");
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;

var VR = undefined;
var loader = new OBJMTLLoader();

loader.load('tropic/tropical2.obj', 'tropic/Small_Tropical_Island.mtl', function(mesh) {
  mesh.scale.set(0.1, 0.1, 0.1);
  mesh.position.set(0, -1, 0);

  World.add(mesh);
  console.log("Ready");
  document.querySelector("canvas").style.display = "block";
  var loader = document.querySelector("img");
  loader.parentNode.removeChild(loader);
  World.start();
  sfx.play();
});

window.addEventListener("deviceorientation", updateOrientation);

document.querySelector("canvas").addEventListener("click", fullscreen, false);
document.querySelector("button").addEventListener("click", function(e) {
  fullscreen(e);
  VR = new VREffect(World.getRenderer());
  VR.setSize(window.innerWidth, window.innerHeight);
  isVRmode = true;
});