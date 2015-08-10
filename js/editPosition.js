//this files handles the svg for editing the (width,height,x,y) of effects
editPosition = {
	svg: undefined,
	effect: undefined,
	size: {
		width: 400,
		height: 400
	},
	settings:{
		gridSize: 10,
		percentSize: 5
	},
	init: function(){
		var _svg = this.svg = new SVG('edit-position-svg');
		_svg.size('100%','auto');
		_svg.viewbox({width:this.size.width,height:this.size.height,x:0,y:0})

		//rect
		this.rect = _svg.rect().size(this.size.width/2,this.size.height/2).center(this.size.width/2,this.size.height/2).fill('#3D4854');

		//grid
		_svg.rect().size(this.size.width,this.size.height).fill(_svg.pattern(this.settings.gridSize, this.settings.gridSize, function(add) {
			add.line(this.settings.gridSize, 0, this.settings.gridSize, this.settings.gridSize).stroke({width: 1})
			add.line(0, this.settings.gridSize, this.settings.gridSize, this.settings.gridSize).stroke({width: 1})
		}.bind(this)));

		//position
		this.position = _svg.rect().size(this.size.width/2,this.size.height/2).center(this.size.width/2,this.size.height/2).fill('rgba(0,0,0,0.2)');
		this.position.select().resize({snapToGrid: this.settings.gridSize}).draggable();
		var gridSize = this.settings.gridSize;
		this.position.on('dragmove',function(){
			this.x(Math.floor(this.x() / gridSize) * gridSize);
			this.y(Math.floor(this.y() / gridSize) * gridSize);
		}).on('dragend',function(){
			this.x(Math.floor(this.x() / gridSize) * gridSize);
			this.y(Math.floor(this.y() / gridSize) * gridSize);
		});
		this.position.on('resizedone',this.updateInputs.bind(this));

		$('#edit-position').on('shown.bs.modal',function(){
			this.position.size(this.position.width(),this.position.height());
		}.bind(this));

		$('#edit-position .save').click(function(event) {
			this.save();
		}.bind(this));

		this.bindInputs();
	},
	editEffect: function(effect){
		$('#edit-position').modal('show');

		this.effect = effect;
		var pos = effect.getPosition();
		this.position
			.move((this.size.width/4) + ((pos.x / this.settings.percentSize) * this.settings.gridSize),(this.size.height/4) + ((pos.y / this.settings.percentSize) * this.settings.gridSize))
			.size((pos.width / this.settings.percentSize)*this.settings.gridSize,(pos.height / this.settings.percentSize)*this.settings.gridSize);
		this.updateInputs();
	},
	save: function(){
		this.updateEffect();

		$('#edit-position').modal('hide');
	},
	updateEffect: function(){
		//update the effects position
		if(this.effect){
			this.effect.setPosition({
				x: (((this.position.x()-this.size.width/4) / this.settings.gridSize) * this.settings.percentSize),
				y: (((this.position.y()-this.size.height/4) / this.settings.gridSize) * this.settings.percentSize),
				width: ((this.position.width() / this.settings.gridSize) * this.settings.percentSize),
				height: ((this.position.height() / this.settings.gridSize) * this.settings.percentSize)
			});
		}
	},
	updateInputs: function(){
		$('#edit-position .input-pos-x').val((((this.position.x()-this.size.width/4) / this.settings.gridSize) * this.settings.percentSize)).attr('step',this.settings.percentSize);
		$('#edit-position .input-pos-y').val((((this.position.y()-this.size.height/4) / this.settings.gridSize) * this.settings.percentSize)).attr('step',this.settings.percentSize);
		$('#edit-position .input-pos-width').val(((this.position.width() / this.settings.gridSize) * this.settings.percentSize)).attr('step',this.settings.percentSize);
		$('#edit-position .input-pos-height').val(((this.position.height() / this.settings.gridSize) * this.settings.percentSize)).attr('step',this.settings.percentSize);
	},
	bindInputs: function(){
		var pos = this.position;
		var gridSize = this.settings.gridSize;
		var percentSize = this.settings.percentSize;
		var offset = {
			x: (this.size.width/4),
			y: (this.size.height/4)
		}
		$('#edit-position .input-pos-x').on('input',function(){
			pos.x(offset.x + parseFloat($(this).val()) * (gridSize / percentSize));
		});
		$('#edit-position .input-pos-y').on('input',function(){
			pos.y(offset.y + parseFloat($(this).val()) * (gridSize / percentSize));
		});
		$('#edit-position .input-pos-width').on('input',function(){
			pos.width(parseFloat($(this).val()) * (gridSize / percentSize));
		});
		$('#edit-position .input-pos-height').on('input',function(){
			pos.height(parseFloat($(this).val()) * (gridSize / percentSize));
		});
	}
}