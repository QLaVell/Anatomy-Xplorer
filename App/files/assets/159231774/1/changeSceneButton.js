var ChangeSceneButton = pc.createScript('changeSceneButton');

// Attributes of the script
ChangeSceneButton.attributes.add('targetScene', { type: 'string', default: 'AR Scene' });

// initialize code called once per entity
ChangeSceneButton.prototype.initialize = function() {
    // Set up a click event handler
    this.entity.element.on('click', this.onChangeScene, this);
};

// Method to change the scene
ChangeSceneButton.prototype.onChangeScene = function() {
    // Load the new scene
    this.loadScene(this.targetScene);
};

// Method to load a new scene
ChangeSceneButton.prototype.loadScene = function(sceneName) {
   // var currentUrl = window.location.href;
    //var newUrl = currentUrl.split('#')[0] + '#' + sceneName;
    //window.location.href = newUrl;
  this.app.scenes.changeScene(sceneName);

};
