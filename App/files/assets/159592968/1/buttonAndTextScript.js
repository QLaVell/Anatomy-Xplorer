var ButtonAndTextScript = pc.createScript('buttonAndTextScript');

ButtonAndTextScript.prototype.initialize = function () {
    // Access the Text Element component
    this.textElement = this.entity.findByName('desc').element;

    // Set up click event handler for the button
    this.entity.button.on('click', this.onButtonClick, this);
};

ButtonAndTextScript.prototype.onButtonClick = function (event) {
    // Change the text
    this.changeText("New Text After Click");
};

ButtonAndTextScript.prototype.changeText = function (newText) {
    // Set the new text
    this.textElement.text = newText;
};
