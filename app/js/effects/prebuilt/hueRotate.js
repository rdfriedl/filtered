import MultiEffect from '../multiEffect.js';

//HueRotate
export default function HueRotateEffect(){
    MultiEffect.apply(this,arguments);

    this.addInput('in',EffectInput);
    this.addInput('amount',RangeInput,{
        min: 0,
        max: 360,
        value: 180,
        step: 1
    });
    this.addOutput('result',EffectOutput);

    this.filter = {};
    this.filter.colorMatrix = new SVG.ColorMatrixEffect('hueRotate');

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
HueRotateEffect.prototype = {
    options: {
        title: 'HueRotate'
    },
    update: function(){
        this.filter.colorMatrix.attr({
            in: this.inputs.in.getValue(),
            values: this.inputs.amount.getValue()
        });
    }
};
HueRotateEffect.prototype.constructor = HueRotateEffect;
HueRotateEffect.prototype.__proto__ = MultiEffect.prototype;
