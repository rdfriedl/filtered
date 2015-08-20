"use strict";

var editLight = {
	scene: undefined,
	camera: undefined,
	renderer: undefined,
	controls: undefined,
	grid: undefined,
	activeMode: '',
	modes: {
		SpotLight: {
			group: undefined,
			init: function(group){

			}
		},
		PointLight: {
			group: undefined,
			light: undefined,
			helper: undefined,
			controls: undefined,
			init: function(group){
				this.light = new THREE.PointLight(0xffffff,1,100);
				this.group.add(this.light);

				this.helper = new THREE.PointLightHelper(this.light, 1);
				this.group.add(this.helper);

				this.controls = new THREE.TransformControls(editLight.camera,editLight.container[0]);
				this.group.add(this.controls);

				this.controls.attach(this.light);

				editLight.controls.addEventListener('change',function(){
					this.controls.update();
				}.bind(this))
			}
		},
		DistantLight: {
			group: undefined,
			init: function(group){

			}
		}
	},
	init: function(){
		this.element = $('#edit-light');
		this.container = this.element.find('#container');

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.container.append(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		this.camera.position.set(15,18,15);

		this.scene = new THREE.Scene();

		this.controls = new THREE.OrbitControls(this.camera,this.container[0]);
		this.controls.damping = 0.2;

		$(window).resize(function(){
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

			this.renderer.setSize( window.innerWidth, window.innerHeight );
		}.bind(this))

		this.initScene();
		this.initModes();
		this.update();
	},
	initScene: function(){
		var grid = new THREE.GridHelper(10,1);
		this.scene.add(grid);
	},
	initModes: function(){
		for(var i in this.modes){
			this.modes[i].group = new THREE.Group();
			this.modes[i].init.call(this.modes[i]);
			this.modes[i].group.visible = false;
			this.scene.add(this.modes[i].group);
		}
	},

	update: function(){
		requestAnimationFrame(this.update.bind(this));

		this.animate();
		this.render();
	},
	animate: function(){
		if(this.modes[this.activeMode]){
			this.modes[this.activeMode].update && this.modes[this.activeMode].update();
		}
	},
	render: function(){
		this.renderer.render(this.scene,this.camera);
	},

	show: function(){
		// this.controls.reset();
		this.element.modal('show');
	},
	enableMode: function(mode){
		for(var i in this.modes){
			this.modes[i].group.visible = false;
		}
		if(this.modes[mode]){
			this.modes[mode].group.visible = true;
			this.activeMode = mode;
		}
	}
}