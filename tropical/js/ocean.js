require('./water-material');

var THREE = require('three');
module.exports = function(renderer, camera, scene, waterNormalMap, skyTexture, waterColor, sunColor) {
  var ocean = new THREE.Object3D();

  var sun = new THREE.DirectionalLight(sunColor === undefined ? 0xffffff : sunColor, 0.5);
  sun.position.set(-800, 800, 800);
  ocean.add(sun);

  var waterNormals = new THREE.ImageUtils.loadTexture(waterNormalMap);
  		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  var water = new THREE.Water(renderer, camera, scene, {
  	textureWidth: 256,
  	textureHeight: 256,
  	alpha: 	0.8,
  	waterNormals: waterNormals,
  	sunDirection: sun.position.normalize(),
  	sunColor: sunColor === undefined ? 0xffffff : sunColor,
  	waterColor: waterColor === undefined ? 0x00aaff : waterColor, //0x001e0f,
  });

  var aMeshMirror = new THREE.Mesh(
  	new THREE.PlaneGeometry(2000, 2000, 100, 100),
  	water.material
  );

  aMeshMirror.add(water);
  aMeshMirror.rotation.x = - Math.PI * 0.5;
  ocean.add(aMeshMirror);

  var sky = new THREE.Mesh(new THREE.SphereGeometry(1200), new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture(skyTexture),
    side: THREE.BackSide
  }));
  ocean.add(sky);

  ocean.update = function() {
    water.material.uniforms.time.value += 1.0 / 60.0;
    water.render();
  };

  return ocean;
}