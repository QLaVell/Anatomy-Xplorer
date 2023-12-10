var LightEstimationRender = pc.createScript('lightEstimationRender');

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
LightEstimationRender.prototype.initialize = function() {
    this.materials = this.entity.findComponents('render').map((render) => {
        return render.material;
    });

    this.texture = new pc.Texture(this.app.graphicsDevice, {
        addressU: pc.ADDRESS_CLAMP_TO_EDGE,
        addressV: pc.ADDRESS_CLAMP_TO_EDGE,
        minFilter: pc.FILTER_NEAREST_MIPMAP_NEAREST,
        magFilter: pc.FILTER_NEAREST,
        format: pc.PIXELFORMAT_RGB16F,
        mipmaps: false,
        cubemap: true
    });

    this._registerListeners('on');
    this.on('destroy', this._onDestroy, this);
};

/**
 * Destroy - clean up resources, listeners.
 */
LightEstimationRender.prototype._onDestroy = function() {
    this._registerListeners('off');
};

/**
 * Update - called once per frame.
 *
 * @param {number} dt - time (in seconds) since last frame.
 */
LightEstimationRender.prototype.update = function(dt) {
    if (!this.app.xr.lightEstimation.available) {
        return;
    }

    for (let i = 0; i < this.materials.length; i++) {
        this.materials[i].ambientSH = this.app.xr.lightEstimation.sphericalHarmonics;
        this.materials[i].update();
    }
};

/** Event Handlers */

/**
 * Register this script's listeners which need to be cleared on entity destruction.
 *
 * @param {string} onOrOff - "on" for attaching the listeners; use "off" for detaching.
 */
LightEstimationRender.prototype._registerListeners = function(onOrOff) {
    this.app[onOrOff]('ar:lightEstimation:available', this._onLightEstimationAvailable, this);
    this.app[onOrOff]('ar:onEnd', this._onArEnd, this);
};

LightEstimationRender.prototype._onLightEstimationAvailable = function() {
    for (let i = 0; i < this.materials.length; i++) {
        this.materials[i].onUpdateShader = function(options) {
            options.ambientSH = true;
            return options;
        };
        this.materials[i].update();
    }
};

LightEstimationRender.prototype._onArEnd = function() {
    for (let i = 0; i < this.materials.length; i++) {
        this.materials[i].onUpdateShader = function(options) {
            options.ambientSH = false;
            return options;
        };
        this.materials[i].ambientSH = null;
        this.materials[i].update();
    }
};
