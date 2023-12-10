var AutoRotate = pc.createScript('autoRotate');

var activeEntity = null;
var isAutoRotateActive = false;

// initialize code called once per entity
AutoRotate.prototype.initialize = function() {
    this.entity.element.on('click', this.onButtonClick, this);
};

AutoRotate.prototype.onButtonClick = function (event) {
    if (window.activeEntity !== undefined && window.activeEntity != null) {
        this.activeEntity = window.activeEntity.entity.findByTag('model')[0];
        // console.log(this.activeEntity);
        this.isAutoRotateActive = !this.isAutoRotateActive;
    }
}

// update code called every frame
AutoRotate.prototype.update = function(dt) {
    if(this.isAutoRotateActive && this.activeEntity != null) {
        // console.log("working");
        this.activeEntity.rotate(0, 0, .25);
        this.activeEntity.rotate(0, .5, 0);
        this.activeEntity.rotate(1, 0, 0);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// AutoRotate.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/