var THREE = require('three');

module.exports = function addLights(world, topColor, bottomColor) {

  // top lights

  var light = new THREE.PointLight(topColor, 4, 800);
  light.position.set(-480, 220, -480);
  world.add(light);

  var light2 = light.clone();
  light2.position.set(480, 220, -480);
  world.add(light2);

  var light3 = light.clone();
  light3.position.set(-480, 220, 480);
  world.add(light3);

  var light4 = light.clone();
  light4.position.set(480, 220, 480);
  world.add(light4);

  // bottom lights

  var light5 = new THREE.PointLight(bottomColor, 4, 800);
  light5.position.set(-480, -220, -480);
  world.add(light5);

  var light6 = light5.clone();
  light6.position.set(480, -220, -480);
  world.add(light6);

  var light7 = light5.clone();
  light7.position.set(-480, -220, 480);
  world.add(light7);

  var light8 = light5.clone();
  light8.position.set(480, -220, 480);
  world.add(light8);
}
