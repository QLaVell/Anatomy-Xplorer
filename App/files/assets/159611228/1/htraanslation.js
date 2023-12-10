var Htraanslation = pc.createScript('htraanslation');

// initialize code called once per entity
Htraanslation.prototype.initialize = function() {
     var buttonEntity=this.entity;
buttonEntity.element.on('click',this.onButtonClick,this);
    
};
Htraanslation.prototype.onButtonClick=function(event){
     // console.log("heart");

     var textEntity = this.app.root.findByName('desc'); 
     textEntity.enabled = true;
    textEntity.element.text = "The human heart is one of the most vital organs in the human body. The human heart keeps on beating until the death of an individual. On average, our heartbeats seventy times per minute, which is close to forty-two hundred times per hour and pumps about 2,000 gallons of blood every day";
}

// update code called every frame
Htraanslation.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Htraanslation.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/