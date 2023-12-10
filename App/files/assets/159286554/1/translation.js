
var Translation = pc.createScript('translation');

// Create array attributes for translation of each organ

Translation.attributes.add("liver_translations", {
    type: "string",
    array: true
});

Translation.attributes.add("heart_translations", {
    type: "string",
    array: true
});

Translation.attributes.add("lungs_translations", {
    type: "string",
    array: true
});

Translation.attributes.add("brain_translations", {
    type: "string",
    array: true
});

// initialize code called once per entity
Translation.prototype.initialize = function() {
    // Get the language index selected from the main menu
    
    var translation_index = 0;

    if(window.index !== undefined) {
    translation_index = window.index;
    // console.log("hsscd ind"+translation_index);
}

    // Set the title for the liver
    var liver_title = this.app.root.findByName("liver_title").element;
    liver_title.text = this.liver_translations[translation_index];

    // Set the title for the heart
    var heart_title = this.app.root.findByName("heart_title").element;
    heart_title.text = this.heart_translations[translation_index];

    // Set the title for the lungs
    var lungs_title = this.app.root.findByName("lungs_title").element;
    lungs_title.text = this.lungs_translations[translation_index];

    // Set the title for the brain
    var brain_title = this.app.root.findByName("brain_title").element;
    brain_title.text = this.brain_translations[translation_index];
};

// update code called every frame
Translation.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Translation.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/