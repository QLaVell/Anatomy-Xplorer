var ClearEntities = pc.createScript('clearEntities');

// initialize code called once per entity
ClearEntities.prototype.initialize = function() {
    this.entity.element.on('click', this.onButtonClick, this);
};

ClearEntities.prototype.onButtonClick = function (event) {
    // console.log("clicked");
    if (window.activeEntity !== undefined && window.activeEntity != null) {
        this.activeEntity = window.activeEntity;
        this.activeEntity.hideChildren();
    }
}

// update code called every frame
ClearEntities.prototype.update = function(dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// ClearEntities.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/