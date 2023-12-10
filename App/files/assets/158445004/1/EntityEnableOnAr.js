var EntityEnableOnAr = pc.createScript('entityEnableOnAr');

/** Attributes */

EntityEnableOnAr.attributes.add('enableOnDefault', {
    type: 'boolean',
    description: 'If set to true, this Entity will be Enabled when not in AR mode.',
    default: true
});

EntityEnableOnAr.attributes.add('enableOnAR', {
    type: 'string',
    enum: [
        { 'Disabled': 'disabled' },
        { 'Always': 'always' },
        { 'On Tracking': 'onTracking' }
    ],
    description: `Disabled: entity will always be disabled during AR session;
        Always: entity will always be enabled during AR session, regardless if XR is available;
        On Tracking: entity will only be enabled after the AR session has started tracking.`,
    default: 'onTracking'
});

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
EntityEnableOnAr.prototype.initialize = function() {
    this._registerListeners('on');
    this.on('destroy', this._onDestroy, this);
};

EntityEnableOnAr.prototype.postInitialize = function() {
    this.entity.enabled = this.enableOnDefault;
};

/**
 * Destroy - clean up resources, listeners.
 */
EntityEnableOnAr.prototype._onDestroy = function() {
    this._registerListeners('off');
};

/** Event Handlers */

/**
 * Register this script's listeners which need to be cleared on entity destruction.
 *
 * @param {string} onOrOff - "on" for attaching the listeners; use "off" for detaching.
 */
EntityEnableOnAr.prototype._registerListeners = function(onOrOff) {
    this.app[onOrOff]('ar:request:start', this._startAugmentedRealitySession, this);
    this.app[onOrOff]('ar:onStart', this._onArStart, this);
    this.app[onOrOff]('ar:onTracking', this._onArTracking, this);
    this.app[onOrOff]('ar:onEnd', this._onArEnd, this);
};

EntityEnableOnAr.prototype._startAugmentedRealitySession = function() {
    this.entity.enabled = false;
};

EntityEnableOnAr.prototype._onArStart = function() {
    if (this.enableOnAR === 'always') {
        this.entity.enabled = true;
    } else {
        this.entity.enabled = false;
    }
};

EntityEnableOnAr.prototype._onArTracking = function() {
    if (this.enableOnAR === 'onTracking') {
        this.entity.enabled = true;
    }
};

EntityEnableOnAr.prototype._onArEnd = function() {
    if (this.enableOnDefault) {
        this.entity.enabled = true;
    }
};
