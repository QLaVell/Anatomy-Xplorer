var AugmentedRealityManager = pc.createScript('augmentedRealityManager');

/** Attributes */

AugmentedRealityManager.attributes.add('spaceType', {
    type: 'string',
    description: `Reference space type. Can be one of the following:
        XRSPACE_VIEWER: Viewer - always supported space with some basic tracking capabilities;
        RSPACE_LOCAL: Local - represents a tracking space with a native origin near the viewer at the time of creation. It is meant for seated or basic local XR sessions;
        XRSPACE_LOCALFLOOR: Local Floor - represents a tracking space with a native origin at the floor in a safe position for the user to stand. The y axis equals 0 at floor level. Floor level value might be estimated by the underlying platform. It is meant for seated or basic local XR sessions;
        XRSPACE_BOUNDEDFLOOR: Bounded Floor - represents a tracking space with its native origin at the floor, where the user is expected to move within a pre-established boundary;
        XRSPACE_UNBOUNDED: Unbounded - represents a tracking space where the user is expected to move freely around their environment, potentially long distances from their starting point.`,
    enum: [
        { 'XRSPACE_VIEWER': pc.XRSPACE_VIEWER },
        { 'XRSPACE_LOCAL': pc.XRSPACE_LOCAL },
        { 'XRSPACE_LOCALFLOOR': pc.XRSPACE_LOCALFLOOR },
        { 'XRSPACE_BOUNDEDFLOOR': pc.XRSPACE_BOUNDEDFLOOR },
        { 'XRSPACE_UNBOUNDED': pc.XRSPACE_UNBOUNDED },
    ],
    default: pc.XRSPACE_LOCALFLOOR
});

AugmentedRealityManager.attributes.add('defaultCameraEntity', {
    type: 'entity',
    description: "Entity with the scene's default, non-AR Camera."
});

AugmentedRealityManager.attributes.add('arCameraEntity', {
    type: 'entity',
    description: "Entity with a Camera component attached which is to be used for AR."
});

AugmentedRealityManager.attributes.add('useInput', {
    type: 'boolean',
    description: "If set to true, listen to available device inputs for interacting with 3D scene objects (such as tapping on a phone).",
    default: true
});

AugmentedRealityManager.attributes.add('useLightEstimation', {
    type: 'boolean',
    description: "If set to true and available on device, use the LightEstimation API.",
    default: true
});

AugmentedRealityManager.attributes.add('useHitTest', {
    type: 'boolean',
    description: "If set to true and available on device, use the HitTest API for placement of 3D objects on real-world geometry.",
    default: true
});

/** Lifecycle Methods */

/**
 * Initialize - setup internal state, resources, listeners.
 */
AugmentedRealityManager.prototype.initialize = function () {
    if (!this.defaultCameraEntity || !this.defaultCameraEntity.camera) {
        console.error('AugmentedRealityManager: invalid defaultCameraEntity!');
        return;
    }
    if (!this.arCameraEntity || !this.arCameraEntity.camera) {
        console.error('AugmentedRealityManager: invalid arCameraEntity!');
        return;
    }

    // start with default camera
    this.defaultCameraEntity.enabled = true;
    this.arCameraEntity.enabled = false;

    this._isArSupported = this.app.xr && this.app.xr.supported && this.app.xr.isAvailable(pc.XRTYPE_AR);
    if (!this._isArSupported) {
        console.warn('WebXR-AR is not supported in this platform.');
    }

    this._registerListeners('on');
    this.on('destroy', this._onDestroy, this);
};

/**
 * PostInitialize - setup stuff that requires all other scripts to already have been initialized.
 */
AugmentedRealityManager.prototype.postInitialize = function () {
    this._onXrAvailabilityUpdate();
};

/**
 * Destroy - clean up resources, listeners.
 */
AugmentedRealityManager.prototype._onDestroy = function () {
    this._registerListeners('off');
};

/** Event Handlers */

/**
 * Register this script's listeners which need to be cleared on entity destruction.
 *
 * @param {string} onOrOff - "on" for attaching the listeners; use "off" for detaching.
 */
AugmentedRealityManager.prototype._registerListeners = function (onOrOff) {
    if (this._isArSupported) {
        this.app[onOrOff]('ar:request:start', this._startAugmentedRealitySession, this);
        this.app[onOrOff]('ar:request:end', this._endAugmentedRealitySession, this);

        this.app.xr[onOrOff]('start', this._onXrStart, this);
        this.app.xr[onOrOff]('end', this._onXrEnd, this);
        this.app.xr[onOrOff]('available:' + pc.XRTYPE_AR, this._onXrAvailabilityUpdate, this);
        this.app.xr[onOrOff]('error', this._onXrError, this);

        if (this.app.xr.lightEstimation && this.app.xr.lightEstimation.supported) {
            this.app.xr.lightEstimation[onOrOff]('available', this._onXrLightEstimationAvailable, this);
            this.app.xr.lightEstimation[onOrOff]('error', this._onXrLightEstimationError);
        }
    }

    if (this.useInput) {
        this.app.keyboard[onOrOff]('keydown', this._onKeyDown, this);

        if (this._isArSupported && this.app.xr.input) {
            this.app.xr.input[onOrOff]('selectstart', this._onXrInputSelectStart, this);
            this.app.xr.input[onOrOff]('selectend', this._onXrInputSelectEnd, this);
        }
        if (this.app.mouse) {
            this.app.mouse[onOrOff](pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
            this.app.mouse[onOrOff](pc.EVENT_MOUSEUP, this._onMouseUp, this);
        }
        if (this.app.touch) {
            this.app.touch[onOrOff](pc.EVENT_TOUCHSTART, this._onTouchStart, this);
            this.app.touch[onOrOff](pc.EVENT_TOUCHEND, this._onTouchEnd, this);
        }
    }
};

/** WebXR Lifecycle Methods. */

AugmentedRealityManager.prototype._startAugmentedRealitySession = function () {
    // switch cameras
    this.defaultCameraEntity.enabled = false;
    this.arCameraEntity.enabled = true;

    // start XR session on the AR Camera
    this.arCameraEntity.camera.startXr(pc.XRTYPE_AR, this.spaceType);
};

AugmentedRealityManager.prototype._endAugmentedRealitySession = function () {
    this.app.xr.end();
};

AugmentedRealityManager.prototype._onXrStart = function () {
    this.app.fire('ar:onStart');

    if (this.useLightEstimation && this.app.xr.lightEstimation.supported) {
        // .start() the light estimation module, if it is to be used
        this.app.xr.lightEstimation.start();
    }

    if (this.useHitTest && this.app.xr.hitTest && this.app.xr.hitTest.supported) {
        const self = this;
        // .start() hit test module, if it is to be used, from viewer position (middle of the screen)
        this.app.xr.hitTest.start({
            spaceType: pc.XRSPACE_VIEWER,
            callback: function (err, hitTestSource) {
                if (err) {
                    // if an error occured, notify that hit system is disabled
                    console.error(err);
                    self.app.fire('ar:hit:disabled');
                    return;
                }

                self.app.fire('ar:hit:start');

                // if hit test session started successfully, listen for the 'result' event
                hitTestSource.on('result', function (position, rotation) {
                    self.app.fire('ar:hit', position, rotation);
                });
            }
        });
    } else {
        this.app.fire('ar:hit:disabled');
    }

    // attach to the XR 'update' loop (called every time the XR scene gets updated),
    // so that we can notify that the XR scene is tracking
    this.app.xr.once('update', this._onXrTracking, this);
};

AugmentedRealityManager.prototype._onXrTracking = function () {
    // Get the FOV of the XR Camera so that we can do screen space UI
    // input correctly
    // https://github.com/playcanvas/engine/issues/4776
    const rawCamera = this.arCameraEntity.camera.camera;
    if (rawCamera.xr && rawCamera.xr.views.length) {
        // calculate frustum based on XR view
        const viewProjMat = new pc.Mat4();
        const view = rawCamera.xr.views[0];
        //viewProjMat.mul2(view.projMat, view.viewOffMat);
        
        viewProjMat.copy(view.projMat);
        const data = viewProjMat.data;

        const fov = (2.0 * Math.atan(1.0 / data[5]) * 180.0) / Math.PI;
        const aspectRatio = data[5] / data[0];
        const farClip = data[14] / (data[10] + 1);
        const nearClip = data[14] / (data[10] - 1);

        const camera = this.arCameraEntity.camera;
        camera.camera.horizontalFov = false;
        camera.camera.fov = fov;
        camera.camera.aspectRatio = aspectRatio;
        camera.camera.farClip = farClip;
        camera.camera.nearClip = nearClip;
    } 

    this.app.fire('ar:onTracking');
};

AugmentedRealityManager.prototype._onXrEnd = function () {
    this.app.fire('ar:onEnd');

    if (this.useLightEstimation && this.app.xr.lightEstimation.supported) {
        // .end() the light estimation module, if it was being used
        this.app.xr.lightEstimation.end();
    }

    // make sure we detach the XR 'update' loop
    this.app.xr.off('update', this._onXrTracking, this);

    // switch cameras
    this.defaultCameraEntity.enabled = true;
    this.arCameraEntity.enabled = false;
};

AugmentedRealityManager.prototype._onXrAvailabilityUpdate = function () {
    this.app.fire('ar:available', this.app.xr.supported && this.app.xr.isAvailable(pc.XRTYPE_AR));
};

AugmentedRealityManager.prototype._onXrError = function (err) {
    console.error(err);
};

/** Light Estimation. */

AugmentedRealityManager.prototype._onXrLightEstimationAvailable = function () {
    this.app.fire('ar:lightEstimation:available', this.app.xr.lightEstimation.available);
};
AugmentedRealityManager.prototype._onXrLightEstimationError = function (err) {
    console.error(err);
};

/** Input Handling. */

/**
 * @param {pc.XrInputSource} xrInputSource - the XR input source data.
 */
AugmentedRealityManager.prototype._onXrInputSelectStart = function (xrInputSource) {
    this._doXrInputRaycast(xrInputSource, 'input:start');
};

/**
 * @param {pc.XrInputSource} xrInputSource - the XR input source data.
 */
AugmentedRealityManager.prototype._onXrInputSelectEnd = function (xrInputSource) {
    this._doXrInputRaycast(xrInputSource, 'input:end');
};

/**
 * @param {pc.MouseEvent} mouseEvent - the mouse input source data.
 */
AugmentedRealityManager.prototype._onMouseDown = function (mouseEvent) {
    if (mouseEvent.button === pc.MOUSEBUTTON_LEFT) {
        this._doScreenInputRaycast(mouseEvent.x, mouseEvent.y, 'input:start');
    }
};

/**
 * @param {pc.MouseEvent} mouseEvent - the mouse input source data.
 */
AugmentedRealityManager.prototype._onMouseUp = function (mouseEvent) {
    if (mouseEvent.button === pc.MOUSEBUTTON_LEFT) {
        this._doScreenInputRaycast(mouseEvent.x, mouseEvent.y, 'input:end');
    }
};

/**
 * @param {pc.TouchEvent} touchEvent - the touch input source data.
 */
AugmentedRealityManager.prototype._onTouchStart = function (touchEvent) {
    for (let i = 0; i < touchEvent.changedTouches.length; ++i) {
        this._doScreenInputRaycast(touchEvent.changedTouches[i].x, touchEvent.changedTouches[i].y, 'input:start');
    }
    touchEvent.event.preventDefault();
};

/**
 * @param {pc.TouchEvent} touchEvent - the touch input source data.
 */
AugmentedRealityManager.prototype._onTouchEnd = function (touchEvent) {
    for (let i = 0; i < touchEvent.changedTouches.length; ++i) {
        this._doScreenInputRaycast(touchEvent.changedTouches[i].x, touchEvent.changedTouches[i].y, 'input:end');
    }
    touchEvent.event.preventDefault();
};

/**
 * @param {pc.XrInputSource} xrInputSource - the XR input source data.
 * @param {string} eventName - the name of the Event to fire at the selected Entity.
 */
AugmentedRealityManager.prototype._doXrInputRaycast = function (xrInputSource, eventName) {
    let vec = new pc.Vec3();
    vec.copy(xrInputSource.getDirection());
    vec.mulScalar(this.arCameraEntity.camera.farClip); // use the AR Camera's far clip
    vec.add(xrInputSource.getOrigin());

    this._doRaycastToEntity(xrInputSource.getOrigin(), vec, eventName);
};

let _doScreenInputRaycastVec = new pc.Vec3();
/**
 * @param {number} screenX - the X position on the screen.
 * @param {number} screenY - the Y position on the screen.
 * @param {string} eventName - the name of the Event to fire at the selected Entity.
 */
AugmentedRealityManager.prototype._doScreenInputRaycast = function (screenX, screenY, eventName) {
    // use the default (non-ar) camera
    this.defaultCameraEntity.camera.screenToWorld(screenX, screenY, this.defaultCameraEntity.camera.farClip, _doScreenInputRaycastVec);
    this._doRaycastToEntity(this.defaultCameraEntity.getPosition(), _doScreenInputRaycastVec, eventName);
};

/**
 * @param {pc.Vec3} start - The world space point where the ray starts.
 * @param {pc.Vec3} end - The world space point where the ray ends.
 * @param {string} eventName - the name of the Event to fire at the selected Entity.
 */
AugmentedRealityManager.prototype._doRaycastToEntity = function (start, end, eventName) {
    const result = this.app.systems.rigidbody.raycastFirst(start, end);
    if (result) {
        result.entity.fire(eventName);
    }
};

/**
 * @param {pc.KeyboardEvent} keyboardEvent
 */
AugmentedRealityManager.prototype._onKeyDown = function (keyboardEvent) {
    if (keyboardEvent.key === pc.KEY_ESCAPE) {
        this._endAugmentedRealitySession();
    }
};
