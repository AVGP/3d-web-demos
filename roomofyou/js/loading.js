module.exports = (function() {
  var loading = true, container;

  this.start = function(elem, imgUrl) {
    container = elem;

    if(imgUrl) {
      var img = new Image();
      img.src = imgUrl;
      container.appendChild(img);
    }
  }

  this.stop = function() {
    loading = false;
    container.parentNode.removeChild(container);
  }

  return this;
})();
