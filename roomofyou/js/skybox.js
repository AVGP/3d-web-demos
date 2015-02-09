var THREE = require('three');

module.exports = function(world, textureUrl) {
  var wallMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture(textureUrl), side: THREE.BackSide }),
      walls = [ wallMaterial, wallMaterial, wallMaterial, wallMaterial, wallMaterial, wallMaterial ];
      roomMaterial = new THREE.MeshFaceMaterial(walls);

  var room = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), roomMaterial);

  world.add(room);
};
