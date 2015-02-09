var THREE = require('three'),
    World = require('three-world'),
    ObjLoader = require('./OBJMTLLoader'),
    Loading = require('./loading'),
    Controls = require('./kinetic-controls'),
    addLights = require('./lights'),
    WebcamTexture = require('./webcam-texture'),
    Skybox = require('./skybox'),
    VREffect = require('./vr-effect');

var isVRmode = false, VR = undefined;

Loading.start(document.getElementById("loading"));

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


World.init({
  camDistance: 0,
  clearColor: 0xffffff,
  ambientLightColor: 0xcccccc,
  farPlane: 5000,
  renderCallback: function() {
    if(webcamTex) webcamTex.update();

    if(isVRmode) {
      console.log("VR rendering");
      VR.render(World.getScene(), camera);
      return false;
    }
    return true;

  },
  rendererOpts: {
    antialias: true
  }
});
World.start();

var camera = World.getCamera();

Controls.init(World.getCamera());
addLights(World, 0x006600, 0x000066);

var loader = new ObjLoader(), mesh, anchor, cam = World.getCamera();

cam.rotation.order = 'YXZ';

var webcamTex = new WebcamTexture();

var screen = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 2.2, 2.2),
  new THREE.MeshPhongMaterial({map: webcamTex.texture })
);
screen.position.set(0.7, 1.2, 0);

anchor = new THREE.Object3D();

loader.load('model/TV2.obj', 'model/TV2.mtl', function(tv) {
  tv.rotation.set(0, -Math.PI/2, 0);
  tv.scale.set(18, 18, 18);
  tv.children[8].material.opacity = 0.25;
  tv.children[8].material.transparent = true;
  tv.children[8].material.needsUpdate = true;
  tv.add(screen);

  for(var side=0; side<4; side++) {
    var sideAnchor = new THREE.Object3D();
    for(var i=0; i<100; i++) {
      var tmp = tv.clone();
      tmp.position.set(-250 + (i % 10) * 50, -250 + Math.floor(i / 10) * 50, -275 );
      sideAnchor.add(tmp);
    }
    sideAnchor.rotation.y = side * (Math.PI/2);
    anchor.add(sideAnchor);
  }
  Loading.stop();

});
World.add(anchor);

Skybox(World, 'cyber3.jpg');

window.addEventListener("deviceorientation", updateOrientation);

document.querySelector("canvas").addEventListener("click", fullscreen, false);
document.querySelector("button").addEventListener("click", function(e) {
//  fullscreen(e);
  VR = new VREffect(World.getRenderer());
  VR.setSize(window.innerWidth, window.innerHeight);
  isVRmode = true;
});
