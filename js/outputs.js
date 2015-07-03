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

        this.endpoint.anchor.x = this.element.offsetLeft + bbox.width + 10;
        this.endpoint.anchor.y = this.element.offsetTop + bbox.height/2;

        this.endpoint.anchor.x /= this.effect.element.offsetWidth;
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
EffectOutput.prototype.constructor = EffectOutput;
EffectOutput.prototype.__proto__ = Output.prototype;