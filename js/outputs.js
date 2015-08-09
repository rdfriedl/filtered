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
        this.endpoint = editor.addEndpoint(this.effect.id,outputEndPoint);
        this.endpoint.setParameter('this',this);
    },
    updateEndpointPosition: function(){
        var bbox = this.element.getBoundingClientRect();

        this.endpoint.anchor.x = this.element.offsetLeft + bbox.width + 10 + 4;
        this.endpoint.anchor.y = this.element.offsetTop + bbox.height/2 + 4;

        this.endpoint.anchor.x /= this.effect.element.offsetWidth;
        this.endpoint.anchor.y /= 55;

        this.endpoint.repaint();
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