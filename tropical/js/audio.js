module.exports = function() {
    var waves   = new Audio('sfx/waves.mp3'),
        birds   = new Audio('sfx/seagulls.mp3'),
        ambient = new Audio('sfx/ambient.ogg');

    ambient.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    waves.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    birds.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    return {
        play: function() {
            ambient.play();
            waves.play();
            birds.play();
        }
    }
};