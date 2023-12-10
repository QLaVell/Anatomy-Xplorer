var EntityRotator = pc.createScript('entityRotator');

/** Attributes */

EntityRotator.attributes.add('speed', {
    type: 'number',
    default: 15
});

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
EntityRotator.prototype.initialize = function() {
    this._multiplier = 0;

    this._registerListeners('on');
    this.on('destroy', this._onDestroy, this);
};

/**
 * Destroy - clean up resources, listeners.
 */
EntityRotator.prototype._onDestroy = function() {
    this._registerListeners('off');
};

/** Event Handlers */

/**
 * Register this script's listeners which need to be cleared on entity destruction.
 *
 * @param {string} onOrOff - "on" for attaching the listeners; use "off" for detaching.
 */
EntityRotator.prototype._registerListeners = function(onOrOff) {
    this.entity[onOrOff]('rotation:set', this._rotationSet, this);
    this.entity[onOrOff]('input:start', this._onInputStart, this);
};

EntityRotator.prototype._rotationSet = function(value) {
    this._multiplier = value;
};

EntityRotator.prototype._onInputStart = function() {
    if (this._multiplier > 0) {
        this._multiplier = -1;
    } else {
        this._multiplier = 1;
    }
};

/**
 * Update - called once per frame.
 *
 * @param {number} dt - time (in seconds) since last frame.
 */
EntityRotator.prototype.update = function(dt) {
    this.entity.rotate(0, this.speed * dt * this._multiplier, 0);
};
