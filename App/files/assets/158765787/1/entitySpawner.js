var EntitySpawner = pc.createScript('entitySpawner');

// Create variables to store orgain templates for spawning
EntitySpawner.attributes.add('heart', {
    type: 'asset',
    assetType: 'template'
});

EntitySpawner.attributes.add('lungs', {
    type: 'asset',
    assetType: 'template'
});

EntitySpawner.attributes.add('brain', {
    type: 'asset',
    assetType: 'template'
});

EntitySpawner.attributes.add('liver', {
    type: 'asset',
    assetType: 'template'
});

// Initialize a global variable to make sure only one organ is spawned at a time
var SpawnedEntity = null;

// initialize code called once per entity
EntitySpawner.prototype.initialize = function() {
    var onSpawnEntity = function(entityToSpawn, spawnX, spawnY, spawnZ) {
        if(SpawnedEntity) {
            SpawnedEntity.destroy();
        }
        if (entityToSpawn === 'Heart') {
            // var mHeart = this.app.assets.get(158571964)
            SpawnedEntity = this.heart.resource.instantiate();
        } else if (entityToSpawn === 'Lungs') {
            SpawnedEntity = this.lungs.resource.instantiate();
        } else if (entityToSpawn === 'Brain') {
            SpawnedEntity = this.brain.resource.instantiate();
        } else if (entityToSpawn === 'Liver') {
            SpawnedEntity = this.liver.resource.instantiate();
        }

        SpawnedEntity.setLocalPosition(spawnX, spawnY, spawnZ);
        this.app.root.findByName('Model').addChild(SpawnedEntity);
    }

    this.app.on('qrScan:spawnEntity', onSpawnEntity);
};

// update code called every frame
EntitySpawner.prototype.update = function(dt) {
    if (this.app.keyboard.isPressed(pc.KEY_H)) {
        // this.app.fire('qrScan:spawnEntity', 'Heart', 0, 0, 0);
        // If an organ as already been spawned, delete it
        if(SpawnedEntity) {
            SpawnedEntity.destroy();
        }
        // Spawn the heart at position 0, 0, 0
        SpawnedEntity = this.heart.resource.instantiate();
        SpawnedEntity.setLocalPosition(0, 0, 0);
        // Add the spawned heart to the hierarchy so it can be visibile within PC
        this.app.root.findByName('Model').addChild(SpawnedEntity);
    }
    else if (this.app.keyboard.isPressed(pc.KEY_L)) {
        // this.onSpawnEntity('Lungs', 0, 0, 0);
        // this.app.fire('qrScan:spawnEntity', 'Heart', 0, 25, 0);
        // If an organ as already been spawned, delete it
        if(SpawnedEntity) {
            SpawnedEntity.destroy();
        }
        // Spawn the lungs at position 0, 0, 0
        SpawnedEntity = this.lungs.resource.instantiate();
        SpawnedEntity.setLocalPosition(0, 0, 0);
        // Add the spawned lungs to the hierarchy so it can be visibile within PC
        this.app.root.findByName('Model').addChild(SpawnedEntity);
    }
    else if (this.app.keyboard.isPressed(pc.KEY_B)) {
        // this.onSpawnEntity('Brain', 0, 0, 0);
        // this.app.fire('qrScan:spawnEntity', 'Heart', 0, -25, 0);
        // If an organ as already been spawned, delete it
        if(SpawnedEntity) {
            SpawnedEntity.destroy();
        }
        // Spawn the brain at position 0, 0, 0
        SpawnedEntity = this.brain.resource.instantiate();
        SpawnedEntity.setLocalPosition(0, 0, 0);
        // Add the spawned brain to the hierarchy so it can be visibile within PC
        this.app.root.findByName('Model').addChild(SpawnedEntity);
    }
    else if (this.app.keyboard.isPressed(pc.KEY_I)) {
        // If an organ as already been spawned, delete it
        if(SpawnedEntity) {
            SpawnedEntity.destroy();
        }
        // Spawn the liver at position 0, 0, 0
        SpawnedEntity = this.liver.resource.instantiate();
        SpawnedEntity.setLocalPosition(0, 0, 0);
        // Add the spawned liver to the hierarchy so it can be visibile within PC
        this.app.root.findByName('Model').addChild(SpawnedEntity);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// EntitySpawner.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/