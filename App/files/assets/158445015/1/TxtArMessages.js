var TxtArMessages = pc.createScript('txtArMessages');

/** Attributes */

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
TxtArMessages.prototype.initialize = function() {
    this.entity.element.enabled = false;

    this._registerListeners('on');
    this.on('destroy', this._onDestroy, this);
};

/**
 * Destroy - clean up resources, listeners.
 */
TxtArMessages.prototype._onDestroy = function() {
    this._registerListeners('off');
};

/** Event Handlers */

/**
 * Register this script's listeners which need to be cleared on entity destruction.
 *
 * @param {string} onOrOff - "on" for attaching the listeners; use "off" for detaching.
 */
TxtArMessages.prototype._registerListeners = function(onOrOff) {
    this.app[onOrOff]('ar:available', this._onArAvailable, this);
    this.app[onOrOff]('ar:onStart', this._onArStart, this);
    this.app[onOrOff]('ar:hit:start', this._onArHitStart, this);
    this.app[onOrOff]('ar:onTracking', this._onArTracking, this);
    this.app[onOrOff]('ar:positioner:place', this._onArPositionPlace, this);
    this.app[onOrOff]('ar:onEnd', this._onArEnd, this);
};

TxtArMessages.prototype._onArAvailable = function(value) {
    if (!value) {
        this.entity.element.enabled = true;
        this.entity.element.text = 'AR is not available on this device';
    }
};

TxtArMessages.prototype._onArStart = function() {
    this.entity.element.enabled = true;
    this.entity.element.text = 'slowly move your device for tracking to begin';
};

TxtArMessages.prototype._onArHitStart = function() {
    this.app.once('ar:hit', this._onArHit, this);
};

TxtArMessages.prototype._onArHit = function() {
    this.entity.element.enabled = true;
    this.entity.element.text = 'interact to place model';
};

TxtArMessages.prototype._onArTracking = function() {
};

TxtArMessages.prototype._onArPositionPlace = function() {
    this.entity.element.enabled = false;
};

TxtArMessages.prototype._onArEnd = function() {
    this.entity.element.enabled = false;
    this.app.off('ar:hit', this._onArHit, this);
};
