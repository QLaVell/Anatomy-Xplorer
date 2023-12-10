var Descibing = pc.createScript('descibing');

// initialize code called once per entity
Descibing.prototype.initialize = function() {
    var buttonEntity=this.entity;
buttonEntity.element.on('click',this.onButtonClick,this);
};

Descibing.prototype.onButtonClick=function(event){
    var textEntity = this.app.root.findByName('desc'); 
    textEntity.enabled = true;
    textEntity.element.text = "Humans have a pair of lungs, which are situated within the thoracic cavity of the chest. Lungs play a major role in the respiratory system.They are structured in such a way that it facilitates the exchange of gases.They are lined by a thin membrane, the presence of bronchioles the smaller tubes, alveoli a balloon-like structure and the group of blood capillaries, which expands the surface area for the exchange of gases.";
}

// update code called every frame
Descibing.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Descibing.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/