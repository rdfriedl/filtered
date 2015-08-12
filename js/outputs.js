//Output
function Output(effect,opts,data){
    this.effect = effect;

    this.options = Object.create(this.options);
    for(var i in opts){
        this.options[i] = opts[i];
    }

    for(var i in data){
        this[i] = data[i];
    }
}
Output.prototype = {
    id: '',
    effect: undefined,
    value: '',
    options: {
        title: 'output'
    },

    getValue: function(){
        if(typeof this.value == 'function'){
            return this.value();
        }
        else{
            return this.value;
        }
    },
    toString: function(){
        return this.getValue();
    },
    show: function(){
        $(this.element).show();
    },
    hide: function(){
        $(this.element).hide();
    },
    render: function(){
        if(!this.effect) return;
        // return $('#temp .effect-input').clone().get(0);
    },
    updateElement: function(){

    },
    _remove: function(){
        editor.deleteEndpoint(this.endpoint)
    }
}
Output.prototype.constructor = Output;

//EffectOutput
function EffectOutput(){
    Output.apply(this,arguments);

    this.element = $('#temp .effect-output').clone().get(0);

    this.initEndpoint()
}
EffectOutput.prototype = {
    endpoint: undefined,
    value: function(){
        return this.effect.getValue();
    },

    initEndpoint: function(){
        this.uuid = this.effect.id+'-'+this.id;
        this.endpoint = editor.addEndpoint(this.effect.id,outputEndPoint,{
            uuid: this.uuid
        });
        this.endpoint.setParameter('this',this);
    },
    updateEndpointPosition: function(){
        var bbox = this.effect.element.getBoundingClientRect();

        // this.endpoint.anchor.x = this.element.offsetLeft + bbox.width + 10 + 4;
        // this.endpoint.anchor.y = this.element.offsetTop + bbox.height/2 + 4;

        // this.endpoint.anchor.x /= this.effect.element.offsetWidth;
        this.endpoint.anchor.x = 1;
        // this.endpoint.anchor.y /= 55;
        this.endpoint.anchor.y = (this.element.offsetTop + this.element.getBoundingClientRect().height/2 + 4) / bbox.height;

        // this.endpoint.repaint();
    },
    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        $(this.element).find('.effect-title').text(this.options.title);
    },
    arange: function(){
        if(!this.effect) return;
        this.effect.arange();
    }
}
EffectOutput.prototype.constructor = EffectOutput;
EffectOutput.prototype.__proto__ = Output.prototype;