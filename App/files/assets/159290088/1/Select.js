var Select = pc.createScript('select');

Select.attributes.add('options', { type : 'string', array : true });
Select.attributes.add('defaultIndex', { type : 'number', default : 0 });
Select.attributes.add('fontSize', { type : 'number', default : 1.1 });
Select.attributes.add('padding', { type : 'number', default : 1.1 });
Select.attributes.add('scaleUnit', {
    type: 'string',
    enum: [
        { 'Viewport Width': 'vw' },
        { 'Viewport Height': 'vh' },
        { 'Pixel': 'px' }
    ],
    default : 'vw'
});

Select.attributes.add('storeValue', { type : 'boolean' });
Select.attributes.add('color', { type : 'rgb' });
Select.attributes.add('fontFamily', { type : 'string', default : 'Arial, sans-serif' });

Select.prototype.initialize = function() {
    this.element = document.createElement('select');
    
    this.element.style.position = 'absolute';
    this.element.style.fontFamily = this.fontFamily;
    
    this.element.style.border = '0px';
    this.element.style.background = 'transparent';
    
    this.element.style.fontSize = this.fontSize + this.scaleUnit;
    this.element.style.padding = this.padding + this.scaleUnit;
    this.element.style.boxSizing = 'border-box';
    
    var color = 'rgb(' + (this.color.r * 255) + ', ' + (this.color.g * 255) + ', ' + (this.color.b * 255) + ')';
    this.element.style.color = color;
    
    this.element.style.outline = 'none';
    document.body.appendChild(this.element);
    
    for(var optionIndex in this.options){
        // console.log("option index: "+optionIndex);
        var option = this.options[optionIndex];
        // console.log("option: "+option);
        var optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.innerText = option;
    
            if(this.defaultIndex == parseInt(optionIndex)){
                optionElement.selected = true;
            }
        
        this.element.appendChild(optionElement);
    }
    
    this.element.selectedIndex = this.defaultIndex;
    // console.log("selected index: "+this.element.selectedIndex);
    
    this.element.onchange = this.onChange.bind(this);
    // console.log("store value: "+this.storeValue);
    if(this.storeValue){
        var value = window.localStorage.getItem(this.entity._guid);
        // console.log("value: "+value);
        
        if(value){
            // console.log("if value");
            this.element.selectedIndex = window.localStorage.getItem(this.entity._guid);
            // console.log("final selected index: "+this.element.selectedIndex);
        }
    }
    var s =this.element.selectedIndex;
    // console.log("s"+s);
    
    this.updateStyle();
    
    this.on('state', function(self){
        if(this.entity.enabled){
            this.element.style.display = 'block'; 
        }else{
            this.element.style.display = 'none'; 
        }
    }, this);
};

Select.prototype.onChange = function() {
    console.log("on change");
    console.log('Dropdown value changed. New index: ' + this.element.selectedIndex);
    if(this.storeValue){
        // console.log("stor: "+this.storeValue);
        // console.log("sdcfd"+this.entity._guid);
        // console.log("final index: "+this.element.selectedIndex);
        window.index = this.element.selectedIndex;
        // console.log("win index: "+window.index);
        window.localStorage.setItem(this.entity._guid, this.element.selectedIndex);
    }
};

Select.prototype.updateStyle = function() {
    if(this.entity.element.screenCorners){
        var position = this.entity.element.screenCorners;
    
        this.element.style.left = position[0].x + 'px';
        this.element.style.bottom = position[0].y + 'px';

        this.element.style.width = (position[2].x - position[0].x) + 'px';
        this.element.style.height = (position[2].y - position[0].y) + 'px';
    }
};

Select.prototype.update = function(dt) {
    this.updateStyle();
};

Select.prototype.getValue = function() {
    return this.element.value;
};