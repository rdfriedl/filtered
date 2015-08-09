//EffectInput
function EffectInput(){
    Input.apply(this,arguments)

    $el = $('#temp .effect-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];

    this.initEndpoint()
}
EffectInput.prototype = {
    endpoint: undefined,
    connection: undefined,
    value: function(){
        return (this.connection)? this.connection.getValue() : null;
    },

    initEndpoint: function(){
        this.endpoint = editor.addEndpoint(this.effect.id,inputEndPoint);
        this.endpoint.setParameter('this',this);
    },
    connectionEvent: function(output,dontChange){
        this.connection = output;
        if(!dontChange) this.change();
    },
    connectionDetachedEvent: function(dontChange){
        this.connection = undefined;
        if(!dontChange) this.change();
    },
    updateEndpointPosition: function(){
        var bbox = this.element.getBoundingClientRect();

        // this.endpoint.anchor.x = this.element.offsetLeft + bbox.width + 10;
        this.endpoint.anchor.y = this.element.offsetTop + bbox.height/2 +4;

        // this.endpoint.anchor.x /= this.effect.element.offsetWidth;
        this.endpoint.anchor.y /= 55;

        this.endpoint.repaint();
    },
    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);
    },
    arange: function(){
        if(!this.connection) return;
        this.connection.arange();
    }
}
EffectInput.prototype.constructor = EffectInput;
EffectInput.prototype.__proto__ = Input.prototype;

//ColorInput
function ColorInput(){
    Input.apply(this,arguments);

    $el = $('#temp .color-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    this.inputElement.addEventListener('input',this.change.bind(this));

    $(this.inputElement).val(this.options.value);
}
ColorInput.prototype = {
    options: {
        value: '#000000'
    },
    value: function(){
        return $(this.inputElement).val();
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);
    }
}
ColorInput.prototype.constructor = ColorInput;
ColorInput.prototype.__proto__ = Input.prototype;

//SelectInput
function SelectInput(){
    Input.apply(this,arguments)

    $el = $('#temp .select-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    this.inputElement.addEventListener('change',this.change.bind(this));
}
SelectInput.prototype = {
    options: {
        options: [],
        value: ''
    },
    value: function(){
        return $(this.inputElement).val();
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);

        var $el = $(this.inputElement);
        $el.children().remove();
        for (var i = 0; i < this.options.options.length; i++) {
            var val = this.options.options[i];
            $('<option>').text(val.title || val).attr('value',val.value || val).appendTo($el);
        };
        $el.val(this.options.value);
    }
}
SelectInput.prototype.constructor = SelectInput;
SelectInput.prototype.__proto__ = Input.prototype;

//NumberInput
function NumberInput(){
    Input.apply(this,arguments)

    $el = $('#temp .number-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    this.inputElement.addEventListener('input',this.change.bind(this));
}
NumberInput.prototype = {
    options: {
        min: undefined,
        max: undefined,
        step: undefined,
        value: 0
    },
    value: function(){
        return parseFloat($(this.inputElement).val());
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);

        $(this.inputElement).attr({
            min: this.options.min,
            max: this.options.max,
            step: this.options.step,
        }).val(this.options.value);
    }
}
NumberInput.prototype.constructor = NumberInput;
NumberInput.prototype.__proto__ = Input.prototype;

//TextInput
function TextInput(){
    Input.apply(this,arguments)

    $el = $('#temp .text-input').clone();

    //events
    this.element = $el[0];
    $el.on('input',this.change.bind(this));
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    this.inputElement.addEventListener('input',this.change.bind(this));
        
    $(this.inputElement).val(this.options.value);
}
TextInput.prototype = {
    options: {
        value: ''
    },
    value: function(){
        return $(this.inputElement).val();
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);
    }
}
TextInput.prototype.constructor = TextInput;
TextInput.prototype.__proto__ = Input.prototype;

//MatrixInput
function MatrixInput(){
    Input.apply(this,arguments)

    $el = $('#temp .matrix-input').clone();

    //events
    this.element = $el[0];
    $el.on('input',this.change.bind(this));
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    this.inputElement.addEventListener('input',this.change.bind(this));
        
    $(this.inputElement).val(this.options.value);
}
MatrixInput.prototype = {
    matrix: [],
    options: {
        value: ''
    },
    value: function(){
        return this.matrix.join(' ');
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    change: function(){
        var rows = $(this.inputElement).val().split('\n');
        for (var i = 0; i < rows.length; i++) {
            rows[i] = rows[i].split(' ');
        };

        this.matrix = [];
        for (var i = 0; i < rows.length; i++) {
            for (var k = 0; k < rows[i].length; k++) {
                if(!isNaN(parseFloat(rows[i][k]))){
                    this.matrix.push(parseFloat(rows[i][k]));
                }
            };
        };

        this.effect.update();
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);
    }
}
MatrixInput.prototype.constructor = MatrixInput;
MatrixInput.prototype.__proto__ = Input.prototype;

//MatrixSizeInput
function MatrixSizeInput(){
    Input.apply(this,arguments)

    $el = $('#temp .matrix-size-input').clone();

    //events
    this.element = $el[0];
    $el.on('input',this.change.bind(this));
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    // this.inputElement.addEventListener('input',this.change.bind(this));

    $(this.inputElement).val(this.options.value);

    for (var i = 0; i < this.options.width*this.options.height; i++) {
        this.matrix.push(this.options.value);
    };
}
MatrixSizeInput.prototype = {
    matrix: [],
    options: {
        width: 3,
        height: 3,
        value: 0
    },
    value: function(){
        return this.matrix.join(' ');
    },
    setSize: function(x,y){
        x = isNaN(x)? 0 : x;
        y = isNaN(y)? x : y;
        this.options.width = x;
        this.options.height = y;
        this.updateElement();
    },
    getSize: function(){
        return {
            width: this.options.width,
            height: this.options.height
        }
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    change: function(){
        var $rows = $(this.inputElement).find('tr');

        this.matrix = [];
        $rows.each(function(i,el){
            $row = $(el);
            $row.find('td').each(function(i,el){
                var val = parseFloat($(el).find('input').val());
                if(!isNaN(val)){
                    this.matrix.push(val);
                }
                else{
                    this.matrix.push(0);
                }
            }.bind(this))
        }.bind(this))

        this.effect.update();
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);

        $(this.inputElement).children().remove();
        for (var row = 0; row < this.options.height; row++) {
            var $tr = $('<tr>');

            for (var col = 0; col < this.options.width; col++) {
                var $td = $('<td>');
                var $input = $('<input>').val(this.options.value).on('change, input',function(event){
                    this.change();
                }.bind(this)).on('focus, mouseup',function(event){
                    event.target.setSelectionRange(0,event.target.value.length)
                }).change(function(){
                    if(isNaN(parseFloat($(this).val()))){
                        $(this).val(0);
                    }
                });
                
                $td.append($input);
                $tr.append($td);
            };

            $(this.inputElement).append($tr);
        };
    }
}
MatrixSizeInput.prototype.constructor = MatrixSizeInput;
MatrixSizeInput.prototype.__proto__ = Input.prototype;

//XYInput
function XYInput(){
    Input.apply(this,arguments)

    $el = $('#temp .xy-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.XinputElement = $el.find('.x-input.effect-input-control')[0];
    this.XinputElement.addEventListener('input',this.change.bind(this));
    this.YinputElement = $el.find('.y-input.effect-input-control')[0];
    this.YinputElement.addEventListener('input',this.change.bind(this));
}
XYInput.prototype = {
    options: {
        min: undefined,
        max: undefined,
        step: undefined,
        value: 0
    },
    value: function(){
        return this.getX() + ' ' + this.getY();
    },
    getX: function(){
        var v = parseFloat($(this.XinputElement).val());
        return !isNaN(v)? v : 0;
    },
    getY: function(){
        var v = parseFloat($(this.YinputElement).val());
        return !isNaN(v)? v : this.getX();
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);

        $(this.XinputElement).attr({
            min: this.options.min,
            max: this.options.max,
            step: this.options.step,
        }).val(this.options.value);

        $(this.YinputElement).attr({
            min: this.options.min,
            max: this.options.max,
            step: this.options.step,
        });//.val(this.options.value); dont set the value since this one can be blank
    }
}
XYInput.prototype.constructor = XYInput;
XYInput.prototype.__proto__ = Input.prototype;