"use strict";

//Input
function Input(effect,opts,data){
    this.effect = effect;

    this.options = Object.create(this.options);
    for(var i in opts){
        this.options[i] = opts[i];
    }

    for(var i in data){
        this[i] = data[i];
    }
}
Input.prototype = {
    id: '',
    effect: undefined,
    element: undefined,
    titleElement: undefined,
    inputElement: undefined,
    options: {
        title: 'input',
        value: '' //default value
    },

    getValue: function(){
        return $(this.inputElement).val();
    },
    getAttrValue: function(){ //returns value only when its not == to options.value
        var v = this.getValue();
        return v==this.options.value? null : v;
    },
    setValue: function(val){
        $(this.inputElement).val(val);
    },
    change: function(){ //fires when input changes
        this.effect.change();
    },
    toString: function(){
        return this.getValue();
    },
    toJSON: function(){
        return this.getAttrValue();
    },
    fromJSON: function(data){
        this.setValue(data);
    },
    fromAttr: function(val){
        this.setValue(val);
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
        if(this.options.title){
            $(this.titleElement).show().text(this.options.title);
        }
        else $(this.titleElement).hide();

        $(this.inputElement).val(this.getValue());
    },
    _remove: function(){
        editor.deleteEndpoint(this.endpoint)
    }
}
Input.prototype.constructor = Input;

//EffectInput
function EffectInput(){
    Input.apply(this,arguments)

    var $el = $('#temp .effect-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];

    this.initEndpoint()
}
EffectInput.prototype = {
    endpoint: undefined,
    connection: undefined,
    getValue: function(){
        return (this.connection)? this.connection.getValue() : null;
    },
    setValue: function(output,dontChange){
        this.connectionEvent(output,dontChange);

        editor.connect({uuids:[output.uuid,this.uuid],editable: true});
    },

    toJSON: function(){
        if(this.connection){
            return [this.connection.effect.id,this.connection.id];
        }
    },
    fromJSON: function(data){
        //find the element and the output and connect to it
        for(var i in page.effects._effects){
            var effect = page.effects._effects[i];
            if(effect.id == data[0]){
                if(effect.outputs[data[1]]){
                    this.setValue(effect.outputs[data[1]],true);
                }
            }
        }
        if(data[0] == page.inputEffect.id){
            var effect = page.inputEffect;
            if(effect.outputs[data[1]]){
                this.setValue(effect.outputs[data[1]],true);
            }
        }
        if(data[0] == page.outputEffect.id){
            var effect = page.outputEffect;
            if(effect.outputs[data[1]]){
                this.setValue(effect.outputs[data[1]],true);
            }
        }
    },

    initEndpoint: function(){
        this.uuid = this.effect.id+'-'+this.id;
        this.endpoint = editor.addEndpoint(this.effect.id,inputEndPoint,{
            uuid: this.uuid
        });
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
        var bbox = this.effect.element.getBoundingClientRect();
        this.endpoint.anchor.y = (this.element.offsetTop + this.element.getBoundingClientRect().height/2 + 2) / bbox.height;
        this.endpoint.repaint();
    },
    render: function(){
        if(!this.effect) return;
        return this.element;
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

    var $el = $('#temp .color-input').clone();

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

    render: function(){
        if(!this.effect) return;
        return this.element;
    }
}
ColorInput.prototype.constructor = ColorInput;
ColorInput.prototype.__proto__ = Input.prototype;

//SelectInput
function SelectInput(){
    Input.apply(this,arguments)

    var $el = $('#temp .select-input').clone();

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

    var $el = $('#temp .number-input').clone();

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
    getValue: function(){
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

//RangeInput
function RangeInput(){
    Input.apply(this,arguments)

    var $el = $('#temp .range-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    this.inputElement.addEventListener('input',this.change.bind(this));
}
RangeInput.prototype = {
    options: {
        min: undefined,
        max: undefined,
        step: undefined,
        value: 0
    },
    getValue: function(){
        return parseFloat($(this.inputElement).val());
    },
    change: function(){
        Input.prototype.change.apply(this,arguments);
        $(this.element).find('.feedback').text(this.getValue());
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);
        $(this.element).find('.feedback').text(this.options.value);

        $(this.inputElement).attr({
            min: this.options.min,
            max: this.options.max,
            step: this.options.step,
        }).val(this.options.value);
    }
}
RangeInput.prototype.constructor = RangeInput;
RangeInput.prototype.__proto__ = Input.prototype;

//TextInput
function TextInput(){
    Input.apply(this,arguments)

    var $el = $('#temp .text-input').clone();

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

    render: function(){
        if(!this.effect) return;
        return this.element;
    }
}
TextInput.prototype.constructor = TextInput;
TextInput.prototype.__proto__ = Input.prototype;

//MatrixInput
function MatrixInput(){
    Input.apply(this,arguments)

    var $el = $('#temp .matrix-size-input').clone();

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
MatrixInput.prototype = {
    matrix: [],
    options: {
        width: 3,
        height: 3,
        value: 0
    },
    getValue: function(){
        return this.matrix.join(' ');
    },
    setValue: function(val){
        val = val || '';
        this.matrix = val.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/g, ' ').split(' ');
    },
    toJSON: function(){
        return {
            width: this.options.width,
            height: this.options.height,
            matrix: this.getValue()
        }
    },
    fromJSON: function(data){
        this.options.width = data.width || this.options.width;
        this.options.height = data.height || this.options.height;
        this.setValue(data.matrix);
        this.updateElement();
    },
    fromAttr: function(data){
        this.setValue(data);
        this.updateElement();
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
            var $row = $(el);
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
                var index = row*this.options.width + col;
                var $td = $('<td>');
                var $input = $('<input>').val((this.matrix[index] !== undefined)? this.matrix[index] : this.options.value).on('change, input',function(event){
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
MatrixInput.prototype.constructor = MatrixInput;
MatrixInput.prototype.__proto__ = Input.prototype;

//XYInput
function XYInput(){
    Input.apply(this,arguments)

    var $el = $('#temp .xy-input').clone();

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
    getValue: function(){
        return this.getX() + ' ' + this.getY();
    },
    setValue: function(val){
        val = val || '';
        var values = val.split(' ');
        this.setX(values[0] || this.options.value);
        if(values[0] !== values[1]){
            this.setY(values[1]);
        }
    },
    getX: function(){
        var v = parseFloat($(this.XinputElement).val());
        return !isNaN(v)? v : 0;
    },
    getY: function(){
        var v = parseFloat($(this.YinputElement).val());
        return !isNaN(v)? v : this.getX();
    },
    setX: function(val){
        $(this.XinputElement).val(val);
    },
    setY: function(val){
        $(this.YinputElement).val(val);
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

//FuncRGBAInput
function FuncRGBAInput(){
    Input.apply(this,arguments)

    this.table = [0,1];

    var $el = $('#temp .funcrgba-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    this.inputElement.addEventListener('input',this.change.bind(this));

    $(this.element).find('.add-table-index').click(function(){
        this.table.push(1);
        this.updateElement();
        this.change();
    }.bind(this))

    $(this.element).find('.remove-table-index').click(function(){
        this.table.pop();
        this.updateElement();
        this.change();
    }.bind(this))

    $(this.element).find('.input-type').on('change',function(event){
        this.type = $(event.target).val();
        this.updateBackground();
        this.updateVisible();
        this.effect.updateEndpoints();
        this.change();
    }.bind(this))

    $(this.element).find('.input-amplitude').on('input',function(){
        this.amplitude = parseFloat($(event.target).val());
        this.change();
    }.bind(this))
    $(this.element).find('.input-exponent').on('input',function(){
        this.exponent = parseFloat($(event.target).val());
        this.change();
    }.bind(this))
    $(this.element).find('.input-offset').on('input',function(){
        this.offset = parseFloat($(event.target).val());
        this.change();
    }.bind(this))
    $(this.element).find('.input-slope').on('input',function(){
        this.slope = parseFloat($(event.target).val());
        this.change();
    }.bind(this))
    $(this.element).find('.input-intercept').on('input',function(){
        this.intercept = parseFloat($(event.target).val());
        this.change();
    }.bind(this))
}
FuncRGBAInput.prototype = {
    options: {
        chanel: "R"
    },
    type: 'identity',
    table: [],
    amplitude: 1,
    exponent: 1,
    offset: 0,
    slope: 1,
    intercept: 0,
    getValue: function(){ //returns obj of values/attrs
        var data = {
            type: this.type,
            tableValues: undefined,
            amplitude: undefined,
            exponent: undefined,
            offset: undefined,
            slope: undefined,
            intercept: undefined
        }
        switch(this.type){
            case "identity":
                break;
            case "table":
                data.tableValues = this.table;
                break;
            case "discrete":
                data.tableValues = this.table;
                break;
            case "linear":
                data.slope = this.slope;
                data.intercept = this.intercept;
                break;
            case "gamma":
                data.amplitude = this.amplitude;
                data.exponent = this.exponent;
                data.offset = this.offset;
                break;
        }

        return data;
    },
    getAttrValue: function(){
        var data = this.getValue();
        var func = function(obj){
            for(var i in obj){
                if(obj[i] == undefined) obj[i] = null;

                if(typeof obj[i] == 'object'){
                    func(obj[i]);
                }
            }
        }
        func(data);
        return data;
    },
    toJSON: function(){
        return this.getValue();
    },
    setValue: function(data){
        data = data || {};

        this.type = data.type || this.type;
        this.table = data.tableValues || this.table;

        this.updateElement();
    },
    _getColor: function(i,d){
        if(isNaN(i)) i = d;
        switch(this.options.chanel){
            case 'R':
                return 'rgb('+Math.round(i*255)+',0,0)';
                break;
            case 'G':
                return 'rgb(0,'+Math.round(i*255)+',0)';
                break;
            case 'B':
                return 'rgb(0,0,'+Math.round(i*255)+')';
                break;
            case 'A':
                var val = Math.round(i*255);
                return 'rgb('+val+','+val+','+val+')';
                break;
        }
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    updateElement: function(){
        Input.prototype.updateElement.call(this);
        var $el = $(this.element);

        //type
        $(this.element).find('.input-type').val(this.type);

        //table
        var $table = $el.find('.input-table');

        $table.find('thead>tr').children().remove();
        $table.find('tbody>tr').children().remove();

        for(var i = 0; i < this.table.length; i++){
            $('<th>')
                .css('background', 'linear-gradient(to right, '+this._getColor(i/this.table.length)+' , '+this._getColor((i+1)/this.table.length)+')')
                .appendTo($table.find('thead>tr'));

            $('<td>').append(
                $('<input class="form-control">')
                    .attr({
                        type: 'text',
                        min: 0,
                        max: 1,
                        step: 0.1,
                        value: this.table[i],
                        'data-index': i
                    })
                    .on('input',function(event){
                        var $this = $(event.target);
                        var val = parseFloat($this.val()) || 0;
                        var i = $this.data('index');
                        this.table[i] = val;
                        
                        this.updateBackground();
                    }.bind(this))
                    .on('focus, mouseup',function(event){
                        event.target.setSelectionRange(0,event.target.value.length)
                    })
                    .on('update-background',function(event){
                        var $this = $(event.target);
                        var val = parseFloat($this.val()) || 0;
                        var i = $this.data('index');
                        var colors = [];

                        switch(this.type){
                            case 'table':
                                switch(i){
                                    case 0:
                                        colors = [
                                            this._getColor(this.table[i]),
                                            this._getColor(((this.table[i+1]+this.table[i])/3)*2,(i+1)/this.table.length)
                                        ];
                                        break;
                                    case this.table.length-1:
                                        colors = [
                                            this._getColor(this.table[i-1] + (this.table[i]-this.table[i-1])/3,i/this.table.length),
                                            this._getColor(this.table[i])
                                        ];
                                        break;
                                    default:
                                        colors = [
                                            this._getColor((this.table[i-1]+this.table[i])/2,i/this.table.length),
                                            this._getColor(this.table[i]),
                                            this._getColor((this.table[i+1]+this.table[i])/2,(i+1)/this.table.length)
                                        ];
                                        break;
                                }
                                break;
                            case 'discrete':
                                colors = [
                                    this._getColor(this.table[i]),
                                    this._getColor(this.table[i])
                                ];
                                break;
                        }

                        $this.css('background', 'linear-gradient(to right, '+colors.join(',')+')');
                    }.bind(this))
            )
            .css({
                'padding': '0px'
            })
            .appendTo($table.find('tbody>tr'))
        }
        this.updateBackground();

        //gamma
        $el.find('.input-amplitude').val(this.amplitude);
        $el.find('.input-exponent').val(this.exponent);
        $el.find('.input-offset').val(this.offset);

        //liner
        $el.find('.input-slope').val(this.slope);
        $el.find('.input-intercept').val(this.intercept);

        this.updateVisible();
        this.effect.updateEndpoints();
    },
    updateBackground: function(){
        $(this.element).find('.input-table thead th').each(function(i,el){
            $(el).css('background', 'linear-gradient(to right, '+this._getColor(i/this.table.length)+' , '+this._getColor((i+1)/this.table.length)+')')
        }.bind(this));
        switch(this.type){
            case 'table':
                var colors = [];

                for(var i = 0; i < this.table.length; i++){
                    colors.push(this._getColor(this.table[i]));
                }

                $(this.element).find('.input-table tbody input').css('background', 'transparent');

                $(this.element).find('.input-table').css('background','linear-gradient(to right, '+colors.join(',')+')');

                //set the text color
                $(this.element).find('.input-table tbody input').each(function(i,el){
                    var color = this._getColor(this.table[i]);
                    $(el).css({
                        color: color
                    }).addClass('invert');
                }.bind(this));
                break;
            case 'discrete':
                $(this.element).find('.input-table tbody input').each(function(i,el){
                    var color = this._getColor(this.table[i]);
                    $(el).css({
                        background: color,
                        color: 'grey'
                    }).removeClass('invert');
                }.bind(this));

                $(this.element).find('.input-table').css('background','transparent');
                break;
        }
    },
    updateVisible: function(){
        $(this.element).find('.type').hide();
        $(this.element).find('.type-'+this.type).show();
    }
}
FuncRGBAInput.prototype.constructor = FuncRGBAInput;
FuncRGBAInput.prototype.__proto__ = Input.prototype;

//ImageInput
function ImageInput(){
    Input.apply(this,arguments)

    var $el = $('#temp .image-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    $(this.inputElement).on('change',this.change.bind(this));
}
ImageInput.prototype = {
    options: {},
    getValue: function(){
        return $(this.inputElement).val();
    },
    setValue: function(url){
        $(this.inputElement).val(url);
        this.updateImage();
    },
    change: function(){
        this.effect.change();
        this.updateImage();
    },
    updateImage: function(){
        var url = $(this.inputElement).val();
        var image = new Image();
        image.onload = function(){
            $(this.inputElement).css({
                'background-image': 'url('+window.escape(url).replace('%3A',':')+')',
                'height': Math.round($(this.inputElement).width() * (image.height/image.width))+'px'
            });
            this.effect.updateEndpoints();
        }.bind(this);
        image.src = url;
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    }
}
ImageInput.prototype.constructor = ImageInput;
ImageInput.prototype.__proto__ = Input.prototype;

//MutiSelectInput
function MutiSelectInput(){
    Input.apply(this,arguments)

    var $el = $('#temp .muti-select-input').clone();

    this.element = $el[0];
    this.titleElement = $el.find('.effect-title')[0];
    this.inputElement = $el.find('.effect-input-control')[0];
    $(this.inputElement).on('change',this.change.bind(this));
}
MutiSelectInput.prototype = {
    options: {
        options: []
    },
    getValue: function(){
        var values = [];
        $(this.inputElement).children().each(function(){
            if(!$(this).attr('disabled') && $(this).val() !== '') values.push($(this).val());
        })
        return values.join(' ');
    },
    setValue: function(data){
        for (var i = 0; i < data.length; i++) {
            $(this.inputElement).children().eq(i).val(data[i]);
        };
        this.updateDisabled();
    },
    toJSON: function(){
        var values = [];
        $(this.inputElement).children().each(function(){
            values.push($(this).val());
        })
        return values;
    },

    render: function(){
        if(!this.effect) return;
        return this.element;
    },
    change: function(){
        this.updateDisabled();
        this.effect.change();
    },
    updateElement: function(){
        var options = this.options.options;
        for (var i = 0; i < options.length; i++) {
            var el = $('<select>').addClass('form-control');

            for (var k = 0; k < options[i].options.length; k++) {
                el.append(
                    $('<option>')
                        .text(options[i].options[k].title!==undefined? options[i].options[k].title : options[i].options[k])
                        .val(options[i].options[k].value!==undefined? options[i].options[k].value : options[i].options[k])
                );
            };

            if(options[i].value) el.val(options[i].value);
            el.on('change',this.change.bind(this));
            el.appendTo(this.inputElement);
        };

        this.updateDisabled();
    },
    updateDisabled: function(){
        var options = this.options.options;
        for (var i = 0; i < options.length; i++) {
            var el = $(this.inputElement).children().eq(i);

            el.removeAttr('disabled');
            if(options[i].disabled){
                if(options[i].disabled.indexOf($(this.inputElement).children().eq(i-1).val()) !== -1){
                    el.attr('disabled','disabled');
                }
            }
            if(options[i].enabled){
                if(options[i].enabled.indexOf($(this.inputElement).children().eq(i-1).val()) !== -1){
                    el.removeAttr('disabled');
                }
            }
        };
    }
}
MutiSelectInput.prototype.constructor = MutiSelectInput;
MutiSelectInput.prototype.__proto__ = Input.prototype;