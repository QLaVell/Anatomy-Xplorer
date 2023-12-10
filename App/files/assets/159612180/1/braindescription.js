var Braindescription = pc.createScript('braindescription');

// initialize code called once per entity
Braindescription.prototype.initialize = function() {
    var buttonEntity=this.entity;
buttonEntity.element.on('click',this.onButtonClick,this);
};

Braindescription.prototype.onButtonClick=function(event){
    var textEntity = this.app.root.findByName('desc'); 
    textEntity.enabled = true;
    textEntity.element.text = "The brain is the most complicated organ in our body. The human brain is located in our head and is surrounded by a strong bony structure, called the skull and is suspended in a layer of fluid called the cerebrospinal fluid, which functions by protecting the brain from minor mechanical shocks and jolts. It is responsible for thoughts, interpretation, regulation and control of body movements.";
}


// update code called every frame
Braindescription.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Braindescription.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/