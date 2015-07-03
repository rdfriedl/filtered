//EffectInput
function EffectInput(){
    Input.apply(this,arguments)

    this.element = $('#temp .effect-input').clone().get(0);

    this.initEndpoint()
}
EffectInput.prototype = {
    endpoint: undefined,
    connection: undefined,
    value: function(){
        return this.connection && this.connection.getValue();
    },

    initEndpoint: function(){
        this.endpoint = editor.addEndpoint(this.effect.id,inputEndPoint);
        this.endpoint.setParameter('this',this);
    },
    connectionEvent: function(info){
        this.connection = info.sourceEndpoint.getParameter('this');
    },
    connectionDetachedEvent: function(info){
        this.connection = undefined;
    },
    updateEndpointPosition: function(){
        var bbox = this.element.getBoundingClientRect();

        // this.endpoint.anchor.x = this.element.offsetLeft + bbox.width + 10;
        this.endpoint.anchor.y = this.element.offsetTop + bbox.height/2;

        // this.endpoint.anchor.x /= this.effect.element.offsetWidth;
        this.endpoint.anchor.y /= 66;

        this.endpoint.repaint();
    },
    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        $(this.element).find('span').text(this.options.title);
    }
}
EffectInput.prototype.constructor = EffectInput;
EffectInput.prototype.__proto__ = Input.prototype;

//ColorInput
function ColorInput(){
    Input.apply(this,arguments)

    this.element = $('#temp .color-input').clone().get(0);
}
ColorInput.prototype = {
    endpoint: undefined,
    options: {
        value: '#000000'
    },
    value: function(){
        return $(this.element).find('input').val();
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        $(this.element).find('input').val(this.options.value);
    }
}
ColorInput.prototype.constructor = ColorInput;
ColorInput.prototype.__proto__ = Input.prototype;

//SelectInput
function SelectInput(){
    Input.apply(this,arguments)

    this.element = $('#temp .select-input').clone().get(0);
}
SelectInput.prototype = {
    endpoint: undefined,
    options: {
        options: [],
        value: ''
    },
    value: function(){
        return $(this.element).find('select').val();
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        var $el = $(this.element);
        for (var i = 0; i < this.options.options.length; i++) {
            var val = this.options.options[i];
            $('<option>').text(val.title || val).attr('value',val.value || val).appendTo($el.find('select'));
        };
        $el.find('select').val(this.options.value);
    }
}
SelectInput.prototype.constructor = SelectInput;
SelectInput.prototype.__proto__ = Input.prototype;

//NumberInput
function NumberInput(){
    Input.apply(this,arguments)

    this.element = $('#temp .number-input').clone().get(0);
}
NumberInput.prototype = {
    endpoint: undefined,
    options: {
        min: 0,
        max: 0,
        step: 1,
        value: 0
    },
    value: function(){
        return parseInt($(this.element).find('input').val());
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        $(this.element).find('input').attr({
            min: this.options.min,
            max: this.options.max,
            step: this.options.step,
        }).val(this.options.value);
    }
}
NumberInput.prototype.constructor = NumberInput;
NumberInput.prototype.__proto__ = Input.prototype;