var BtnRotator = pc.createScript('btnRotator');

/** Attributes */

BtnRotator.attributes.add('targetEntity', {
    type: 'entity'
});
BtnRotator.attributes.add('speed', {
    type: 'number',
    default: 1
});

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
BtnRotator.prototype.initialize = function() {
    this.entity.button.on('click', function () {
        this.targetEntity.fire('rotation:set', this.speed);
    }, this);
};
