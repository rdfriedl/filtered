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
        this.endpoint.anchor.y = this.element.offsetTop + bbox.height/2;

        // this.endpoint.anchor.x /= this.effect.element.offsetWidth;
        this.endpoint.anchor.y /= 50;

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
        $(this.inputElement).val(this.options.value);
    }
}
ColorInput.prototype.constructor = ColorInput;
ColorInput.prototype.__proto__ = Input.prototype;

//SelectInput
function SelectInput(){
    Input.apply(this,arguments)

    $el = $('#temp .select-input').clone();

    this.element = $el.get(0);
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

    this.element = $el.get(0);
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

    //events
    $el.on('input',this.change.bind(this));
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    this.inputElement.addEventListener('input',this.change.bind(this));
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
        
        $(this.inputElement).val(this.options.value);
    }
}
TextInput.prototype.constructor = TextInput;
TextInput.prototype.__proto__ = Input.prototype;