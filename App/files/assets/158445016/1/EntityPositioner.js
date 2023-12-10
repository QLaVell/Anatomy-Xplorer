var EntityPositioner = pc.createScript('entityPositioner');

/** Attributes */

EntityPositioner.attributes.add('targetEntity', {
    type: 'entity',
    description: 'The target entity to position.'
});

EntityPositioner.attributes.add('pointerPreviewEntity', {
    type: 'entity',
    description: '(Optional) If set, an entity to be positioned on the current AR HitTest location.'
});

EntityPositioner.attributes.add('defaultDistance', {
    type: 'number',
    description: 'The default distance to position the target entity if hitTest is not available.',
    default: 2
});

EntityPositioner.attributes.add('useInput', {
    type: 'boolean',
    description: 'If set to True, allow for input (mouse, touch) to scale this Entity.',
    default: true
});

EntityPositioner.attributes.add('scaleSensitivity', {
    type: 'number', 
    default: 0.2, 
    description: 'If useInput is set to True, how sensitive scaling is.'
});

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
EntityPositioner.prototype.initialize = function() {
    if (this.pointerPreviewEntity) {
        this.pointerPreviewEntity.enabled = false;
    }

    this._scale = 1.0;
    this._hasPositioned = false;
    this._isPinch = false;

    this._inputSources = [];
    this._lastPinchDistance = 0;

    this._registerListeners('on');
    this.on('destroy', this._onDestroy, this);
};

/**
 * Destroy - clean up resources, listeners.
 */
EntityPositioner.prototype._onDestroy = function() {
    this._registerListeners('off');
};

EntityPositioner.prototype.update = function(dt) {
    if (this.useInput) {
        this._updateXrInput();
    }
};

/** Event Handlers */

/**
 * Register this script's listeners which need to be cleared on entity destruction.
 *
 * @param {string} onOrOff - "on" for attaching the listeners; use "off" for detaching.
 */
EntityPositioner.prototype._registerListeners = function(onOrOff) {
    this.app[onOrOff]('ar:request:start', this._startAugmentedRealitySession, this);
    this.app[onOrOff]('ar:onTracking', this._onTracking, this);

    this.app[onOrOff]('ar:hit', this._onArHit, this);
    this.app[onOrOff]('ar:hit:disabled', this._arHitDisabled, this);

    this.app[onOrOff]('ar:onEnd', this._onArEnd, this);

    if (this.app.xr && this.app.xr.input) {
        this.app.xr.input[onOrOff]('selectstart', this._onXrSelectStart, this);
        this.app.xr.input[onOrOff]('selectend', this._onXrSelectEnd, this);
    }
};

/** AR Lifecycle */

EntityPositioner.prototype._startAugmentedRealitySession = function() {
    if (this.pointerPreviewEntity) {
        this.pointerPreviewEntity.enabled = false;
    }

    this.targetEntity.enabled = false;
    this.targetEntity.setLocalPosition(0, 0, 0);
    this._hasPositioned = false;
};

EntityPositioner.prototype._onTracking = function() {
    if (this._hasPositioned) {
        this.targetEntity.enabled = true;
        this.pointerPreviewEntity.enabled = false;
        this.app.fire('ar:positioner:place');
    }
};

EntityPositioner.prototype._onArHit = function(position, rotation) {
    if (this.pointerPreviewEntity && !this.targetEntity.enabled) {
        this.pointerPreviewEntity.enabled = true;
        this.pointerPreviewEntity.setPosition(position);
        this.pointerPreviewEntity.setRotation(rotation);
    }
};

EntityPositioner.prototype._arHitDisabled = function() {
    if (this.pointerPreviewEntity) {
        this.pointerPreviewEntity.enabled = false;
    }

    this.targetEntity.setLocalPosition(0, 0, -this.defaultDistance);
    this._hasPositioned = true;
};

EntityPositioner.prototype._onArEnd = function() {
    this._scale = 1.0;

    // reset entities to identity transforms
    this.targetEntity.enabled = true;
    this.targetEntity.setLocalPosition(0, 0, 0);
    this.targetEntity.setLocalScale(1, 1, 1);

    if (this.pointerPreviewEntity) {
        this.pointerPreviewEntity.setLocalScale(1, 1, 1);
        this.pointerPreviewEntity.enabled = false;
    }
};

/** XR Input Event Handlers */

EntityPositioner.prototype._getPinchDistance = function (pointA, pointB) {
    // Return the distance between the two points
    var dx = pointA.x - pointB.x;
    var dy = pointA.y - pointB.y;    
    
    return Math.sqrt((dx * dx) + (dy * dy));
};

EntityPositioner.prototype._onXrSelectStart = function(inputSource) {
    // add new inputSource to array
    this._inputSources.push(inputSource);

    if (this._inputSources.length === 2) {
        // initialize multitouch
        this._lastPinchDistance = this._getPinchDistance(this._inputSources[0].getOrigin(), this._inputSources[1].getOrigin());
        this._isPinch = true;
    }
};

EntityPositioner.prototype._onXrSelectEnd = function(inputSource) {
    // check if it was waiting for an input to place the entity, and if so, place it
    if (this._inputSources.length === 1 && !this._hasPositioned && !this._isPinch) {
        this._hasPositioned = true;
        this.targetEntity.setLocalPosition(this.pointerPreviewEntity.getLocalPosition());
        this._onTracking();
    }

    // remove inputSource from array
    const id = this._inputSources.indexOf(inputSource);
    if (id > -1) {
        this._inputSources.splice(id, 1);
    }
    if (this._inputSources.length === 0) {
        this._isPinch = false;
    }
};

EntityPositioner.prototype._updateXrInput = function() {
    if (this._inputSources.length === 2) {
        // Calculate the difference in pinch distance since the last event
        var currentPinchDistance = this._getPinchDistance(this._inputSources[0].getOrigin(), this._inputSources[1].getOrigin());
        var diffInPinchDistance = currentPinchDistance - this._lastPinchDistance;
        this._lastPinchDistance = currentPinchDistance;

        // Set Entity scale to both target entity, and the preview (if visible)
        this._scale -= (diffInPinchDistance * this.scaleSensitivity * 0.1) * (this._scale * 0.1);
        this.targetEntity.setLocalScale(this._scale, this._scale, this._scale);
        if (this.pointerPreviewEntity && this.pointerPreviewEntity.enabled) {
            this.pointerPreviewEntity.setLocalScale(this._scale, this._scale, this._scale);
        }
    }
};
