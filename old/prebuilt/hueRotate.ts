import MultiEffect from '../multiEffect';
import * as inputs from '../inputs';
import * as outputs from '../outputs';

//HueRotate
export default class HueRotateEffect extends MultiEffect{
    constructor(){
        super(...arguments);

        this.addInput('in',inputs.EffectInput);
        this.addInput('amount',inputs.RangeInput,{
            min: 0,
            max: 360,
            value: 180,
            step: 1
        });
        this.addOutput('result',outputs.EffectOutput);

        this.filter = {};
        this.filter.colorMatrix = new SVG.ColorMatrixEffect('hueRotate');

        this.render();
        this.update();
        this.updateElement();
        this.updateEndpoints();
        this.updatePostion();
    }
    options = {
        title: 'HueRotate'
    }
    update(){
        this.filter.colorMatrix.attr({
            in: this.inputs.in.getValue(),
            values: this.inputs.amount.getValue()
        });
    }
};
