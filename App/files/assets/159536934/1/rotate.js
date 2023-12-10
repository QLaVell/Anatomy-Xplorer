var Rotate = pc.createScript('rotate');

Rotate.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
Rotate.attributes.add('orbitSensitivity', {
    type: 'number', 
    default: 0.3, 
    title: 'Orbit Sensitivity', 
    description: 'How fast the camera moves around the orbit. Higher is faster'
});


// initialize code called once per entity
Rotate.prototype.initialize = function() {
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    
    this.lastTouchPoint = new pc.Vec2();
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);        
    }
    
    this.on('destroy', function () {
        this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

        if (this.app.touch) {
            this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
            this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);        
        }
    }, this); 
};


Rotate.horizontalQuat = new pc.Quat();
Rotate.verticalQuat = new pc.Quat();
Rotate.resultQuat = new pc.Quat();

Rotate.prototype.rotate = function (dx, dy) {
    var horzQuat = Rotate.horizontalQuat;
    var vertQuat = Rotate.verticalQuat;
    var resultQuat = Rotate.resultQuat;

    // Create a rotation around the camera's orientation in order for them to be in 
    // screen space  
    horzQuat.setFromAxisAngle(this.cameraEntity.up, dx * this.orbitSensitivity);
    vertQuat.setFromAxisAngle(this.cameraEntity.right, dy * this.orbitSensitivity);

    // Apply both the rotations to the existing entity rotation
    resultQuat.mul2(horzQuat, vertQuat);
    resultQuat.mul(this.entity.getRotation());

    this.entity.setRotation(resultQuat);    
};


Rotate.prototype.onTouchStart = function (event) {
    var touch = event.touches[0];
    this.lastTouchPoint.set(touch.x, touch.y);
};


Rotate.prototype.onTouchMove = function (event) {
    var touch = event.touches[0];
    var dx = touch.x - this.lastTouchPoint.x;
    var dy = touch.y - this.lastTouchPoint.y;
    
    this.rotate(dx, dy);
    
    this.lastTouchPoint.set(touch.x, touch.y);
};

Rotate.prototype.onMouseMove = function (event) {    
    var mouse = this.app.mouse;
    if (mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
        this.rotate(event.dx, event.dy);
    }
};
