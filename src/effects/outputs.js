import * as styles from '../jsplumbStyles.js';

//Output
export class Output{
    constructor(effect,opts,data){
        this.effect = effect;

        this.options = Object.create(this.options);
        for(var i in opts){
            this.options[i] = opts[i];
        }

        for(var k in data){
            this[k] = data[k];
        }
    }
    id = ''
    effect = undefined
    value = ''
    options = {
        title: 'output'
    }

    getValue(){
        if(typeof this.value == 'function'){
            return this.value();
        }
        else{
            return this.value;
        }
    }
    toString(){
        return this.getValue();
    }
    show(){
        $(this.element).show();
    }
    hide(){
        $(this.element).hide();
    }
    render(){
        if(!this.effect) return;
        // return $('#temp .effect-input').clone().get(0);
    }
    updateElement(){

    }
    _remove(){
        editor.deleteEndpoint(this.endpoint);
    }
};

//EffectOutput
export class EffectOutput extends Output{
    constructor(){
        super(...arguments);

        this.element = $('#temp .effect-output').clone().get(0);

        this.initEndpoint();
    }
    endpoint = undefined
    value(){
        return this.effect.getValue();
    }

    initEndpoint(){
        this.uuid = this.effect.id+'-'+this.id;
        this.endpoint = editor.addEndpoint(this.effect.id,styles.outputEndPoint,{
            uuid: this.uuid
        });
        this.endpoint.setParameter('this',this);
    }
    updateEndpointPosition(){
        var bbox = this.effect.element.getBoundingClientRect();

        // this.endpoint.anchor.x = this.element.offsetLeft + bbox.width + 10 + 4;
        // this.endpoint.anchor.y = this.element.offsetTop + bbox.height/2 + 4;

        // this.endpoint.anchor.x /= this.effect.element.offsetWidth;
        this.endpoint.anchor.x = 1;
        // this.endpoint.anchor.y /= 55;
        this.endpoint.anchor.y = (this.element.offsetTop + this.element.getBoundingClientRect().height/2 + 4) / bbox.height;

        // this.endpoint.repaint();
    }
    render(){
        if(!this.effect) return;
        return this.element;
    }
    updateElement(){
        $(this.element).find('.effect-title').text(this.options.title);
    }
    arange(){
        if(!this.effect) return;
        this.effect.arange();
    }
};
