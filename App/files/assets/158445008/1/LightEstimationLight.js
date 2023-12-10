/**
 * If available, use AR Light Estimation, which provides illumination data from the real world, estimated by the underlying AR system.
 */
var LightEstimationLight = pc.createScript('lightEstimationLight');

/** Attributes */

LightEstimationLight.attributes.add('updateIntensity', {
    type: 'boolean',
    description: 'If true, the intesity of the Light component will be updated based on the estimated light intensity value.',
    default: true
});

LightEstimationLight.attributes.add('maxIntensity', {
    type: 'number',
    description: 'If updateIntensity is set, cap the light intesity to this value.',
    default: 1,
    min: 0,
    max: 8
});

LightEstimationLight.attributes.add('updateColor', {
    type: 'boolean',
    description: 'If true, the color of the Light component will be updated based on the estimated light color value.',
    default: true
});

LightEstimationLight.attributes.add('updateRotation', {
    type: 'boolean',
    description: 'If true, the rotation of the Entity will be updated based on the estimated light rotation.',
    default: true
});

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
LightEstimationLight.prototype.initialize = function() {
    // copy starting data
    this._startingIntensity = this.entity.light.intensity;
    this._startingColor = new pc.Color().copy(this.entity.light.color);
    this._startingRotation = new pc.Quat().copy(this.entity.getRotation());

    this._updateLight = false;

    this._registerListeners('on');
    this.on('destroy', this._onDestroy, this);
};

/**
 * Destroy - clean up resources, listeners.
 */
LightEstimationLight.prototype._onDestroy = function() {
    this._registerListeners('off');
};

/** Event Handlers */

/**
 * Register this script's listeners which need to be cleared on entity destruction.
 *
 * @param {string} onOrOff - "on" for attaching the listeners; use "off" for detaching.
 */
LightEstimationLight.prototype._registerListeners = function(onOrOff) {
    this.app[onOrOff]('ar:onEnd', this._onArEnd, this);
};

LightEstimationLight.prototype._onArEnd = function() {
    this.entity.light.intensity = this._startingIntensity;
    this.entity.light.color = this._startingColor;
    this.entity.setRotation(this._startingRotation);
};

/**
 * Update - called once per frame.
 *
 * @param {number} dt - time (in seconds) since last frame.
 */
LightEstimationLight.prototype.update = function(dt) {
    if (!this.app.xr.lightEstimation.available) {
        return;
    }

    if (this.updateIntensity) {
        this.entity.light.intensity = Math.min(this.app.xr.lightEstimation.intensity, this.maxIntensity);
    }

    if (this.updateColor) {
        this.entity.light.color = this.app.xr.lightEstimation.color;
    }

    if (this.updateRotation) {
        this.entity.setRotation(this.app.xr.lightEstimation.rotation);
    }
};
