var Liverdescription = pc.createScript('liverdescription');

// initialize code called once per entity
Liverdescription.prototype.initialize = function() {
    var buttonEntity=this.entity;
buttonEntity.element.on('click',this.onButtonClick,this);
};

Liverdescription.prototype.onButtonClick=function(event){
    var textEntity = this.app.root.findByName('desc'); 
    textEntity.element.text = "The liver is the largest internal organ in the human body, which weighs between 1.3 to 1.5 kg. The liver is located in the upper right portion of the abdomen. It performs more than 500 functions, including blood clotting, protecting from the invading pathogens, synthesis of hormones and proteins and secretes various enzymes and chemicals.";
    textEntity.enabled = true;
    // console.log(textEntity);
}
// update code called every frame
Liverdescription.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Liverdescription.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/