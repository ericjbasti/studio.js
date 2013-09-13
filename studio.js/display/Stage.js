define(['display/Shape', 'display/Camera'], function(_s) {

	_s.Stage = function(id) {
		this.type = 'Studio.Stage';
		this.name = 'stage';
		this.color = '#000';
		this.animations = {};
		var me = this;
		this._children = null;
		this._loader = null;
		this.speed = 1;
		this.resolution = window.devicePixelRatio || 1;
		this.responsive = false;
		//CANVAS GOODNESS
		this.canvas = document.getElementById(id);
		//this.displayCTX = this.canvas.getContext('2d');
		//this.canvas = Canvas;
		
		this.startTime = 0;
		this.buffer= document.createElement('canvas');
		
		//this.ctx=this.buffer.getContext("2d");
		this.ctx=this.canvas.getContext('2d');
		//
		//this.ctx.imageSmoothingEnabled = false;
		//
		this.ctx.resolution= this.resolution;
		this.ctx._interactives = null;
		this.ctx.then = this.startTime = Date.now();
		this._setDimensions(this.canvas.width,this.canvas.height);
		//this.buffer.height=this.canvas.height;
		//this.buffer.width=this.canvas.width;
		//this.timeDelta = 0;
		//this.now = 0;
		this.parent = this.canvas;

		// in our world everything is viewed with a Camera
		this.setCamera(new _s.Camera('camera_1', this.ctx));
		this.ready = false;
		this.update = true;
		this.loop = function() {
			me.tick();
			requestAnimationFrame(me.loop);
			if (_s.loaded) {
				if (me.speed > 0 && !me.onReady) {
					me.render();
					return;
				}
				if (me.onReady) {
					me.onReady();
					me.onReady = null;
				}
			} else {
				if (me._loader) {
					me.drawLoader();
				} else {
					me.drawProgress();
				}
			}
		};

		this.plugins = {
			effect: [],
			input: []
		};

	};


	_s.Stage.prototype = new _s.Shape();
	_s.Stage.prototype.constructor = _s.Stage;

	_s.Stage.prototype._setDimensions = function(width,height){
		this.width = width;
		this.height = height;
		this.canvas.style.width=width+'px';
		this.canvas.style.height=height+'px';
		this.canvas.width=width*this.resolution;
		this.canvas.height=height*this.resolution;
		this.ctx.width = this.canvas.width;
		this.ctx.height = this.canvas.height;
	};
	
	_s.Stage.prototype.resize = function(){
		var who=this._respondTo;
		this._setDimensions(who.clientWidth||who.innerWidth,who.clientHeight||who.innerHeight);
		this._updateResponders();
		if(this.onResize) this.onResize();
	}
	_s.Stage.prototype.setResponsive = function(status,who){
		this.responsive=status;
		if(this.responsive && !this.ctx._reponders) this.ctx._responders=[];
		
		who= this._respondTo = document.getElementById(who) || window;
		this._setDimensions(who.clientWidth||who.innerWidth,who.clientHeight||who.innerHeight);
		
		if(this.responsive){
			var me=this;
			window.onresize=function(){me.resize()};
		}else{
			window.onresize=function(){};
		}
	};
	_s.Stage.prototype._updateResponders = function(){
		var responders=this.ctx._responders;
		var length=responders.length;
		for (var i=0;i!=length;i++){
			var responder=responders[i];
			var percent=null;
			if(responder.rWidth){
				percent=parseFloat(responder.rWidth);
				responder.width=this.width*(percent/100);
			}
			if(responder.rHeight){
				percent=parseFloat(responder.rHeight);
				responder.height=this.height*(percent/100);
			}
			if(responder.vPosition){
				switch (responder.vPosition){
					case 'bottom' : responder.y=this.height-responder.height;break;
					case 'center' : responder.y=(this.height/2)-(responder.height/2);break;
					default : percent=parseFloat(responder.vPosition); responder.y=(this.height*(percent/100))-responder.height;break;
				}
			}
			if(responder.hPosition){
				switch (responder.hPosition){
					case 'right' : responder.x=(this.width-responder.width);break;
					case 'center' : responder.x=((this.width/2)-(responder.width/2));break;
					default : percent=parseFloat(responder.hPosition); responder.x=(this.width*(percent/100))-responder.width;break;
				}
			}
		}
	};

	_s.Stage.prototype.setCamera = function(who) {
		this.camera = who;
		this.camera.resolution = this.resolution;
	};

	_s.Stage.prototype.updateCamera = function(who) {
		// this.camera.update();
		// this._scaleX = 1;
		// this._scaleY = 1;
		// this._alpha = this.camera.alpha;
		// this._speed = this.camera.speed;

		this.camera.update();
		this._x = this.camera.x;
		this._y = this.camera.y;
		this._scaleX = this.camera.scaleX * this.resolution;
		this._scaleY = this.camera.scaleY * this.resolution;
		this._rotate = this.camera.rotate;
		this._speed = this.camera.speed;
		this._alpha = this.camera.alpha;
	}

	_s.Stage.prototype.render = function() {
		var s = this.ctx;
		var camera = this.camera;

		var effects = this.plugins.effect;
		var inputs = this.plugins.input;

		if (inputs.length) {
			length = inputs.length;
			for (i = 0; i != length; i++) {
				inputs[i](s);
			}
		}

		if (this.onEnterFrame) this.onEnterFrame(s.frameRatio * this.speed, s.frameRatio);
		if (!this.color) {
			s.clearRect(0, 0, s.width, s.height);
		} else {
			s.fillStyle = this.color;
			s.fillRect(0, 0, s.width, s.height);
		}
		this.updateCamera();
		//s.save();
		//s.scale(this.resolution,this.resolution);
		s.globalAlpha = camera.alpha;
		//s.translate(camera.x,camera.y);
		//s.scale(camera.scaleX,camera.scaleX);
		this.renderChildren();
		//s.restore();
		if (this.onExitFrame) this.onExitFrame(s.frameRatio * this.speed, s.frameRatio);
		if (effects.length) {
			length = effects.length;
			for (i = 0; i != length; i++) {
				effects[i](s);
			}
		}
	};

	_s.Stage.prototype.tick = function() {
		var now = this.ctx.now = Date.now();
		this.ctx.delta = now - this.ctx.then;
		//if (delta > 41) delta = 41; 
		this.ctx.then = now;
		this.ctx.frameRatio = 60 / (1000 / this.ctx.delta);
	};

	_s.Stage.prototype.addInput = function(fn, type) {
		this.plugins.input.push(fn);
	};

	_s.Stage.prototype.addEffect = function(fn, type) {
		this.plugins.effect.push(fn);
	};

	_s.Stage.prototype.drawLoader = function() {
		var progress = _s.queue / _s.assets.length;
		if (this.update) {
			this._loader.render(progress);
		}
	};

	_s.Stage.prototype.drawProgress = function() {
		var progress = _s.queue / _s.assets.length;

		var ctx = this.ctx;
		var x = (ctx.width - 202) / 2;
		var y = (ctx.height - 22) / 2;

		var r = parseInt(Math.random() * 255);
		var g = 168;
		var b = 255;
		var color = "rgba(" + r + "," + g + "," + b + ",1)";
		ctx.fillStyle = color;
		ctx.fillRect(x - 5, y - 5, 202 + 10, 22 + 10);
		ctx.fillStyle = 'rgba(255,255,255,.8)';
		ctx.fillRect(x, y, 202, 22);
		ctx.fillStyle = color;
		ctx.fillRect(x + 2, y + 2, progress * 198, 18);
		ctx.restore();
	};


	// autoPause will add the needed listeners to make the canvas stop playing when the user is nolonger viewing its tab

	// ??? what was the idea with this? 
	// ???
	//	_s.Stage.prototype.trash = function(a){
	//		if(!this.ctx.trash) this.ctx.trash=[];
	//		this.ctx.trash.push(a);
	//	}


	_s.Stage.prototype.autoPause = function() {
		var me = this;

		window.addEventListener("blur", function() {
			me.speed = 0;
			console.log('paused');
		}, false);

		window.addEventListener("focus", function() {
			me.ctx.then = me.ctx.now;
			me.speed = 1;
		}, false);
	};

	return _s;
});