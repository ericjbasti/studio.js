define(['studio'], function(_s) {
	_s.DisplayObject = function(name) {
		this.name= name || 'display-object';
	
		this.x = 0;
		this.y = 0;
		this.z = 0;

		this.width = 1;
		this.height = 1;

		this.anchorX = 0;
		this.anchorY = 0;

		this.scaleX = 1;
		this.scaleY = 1;

		this.rotate = 0;
		this.radius = 0.5;
		this.angle = 0;

		this.orbit = true;
		this.orbitSpeed = 1;
		this.receiveRotation = true;

		this.alpha = 1;
		this.visible = true;

		this.live = false;
		this.speed = 1;

		this.isResponsive = false;
		
		// this is a pointer to a drawable canvas
		this.ctx = null;

		// private variables
		this._children = null;
		this._default_inheritence();

		this.type = 'Studio.DisplayObject';
		return this;
	};

	_s.DisplayObject.prototype = {
		apply: function(obj) {
			var keys = Object.keys(obj);
			var i = keys.length;
			var key;
			while (i) {
				key = keys[i-1];
				this[key] = obj[key];
				i--;
			}
		},
		remove: function() {
			this.runaway();
			this._destroy();
		},
		removeChildren: function(){
			while (this._children.length){
				this._children[0].remove();
			}
		},
		runaway: function() {
			// the object runs away so the parent can no longer call on it
			// you should only call this in situation that require the object
			// to be removed but come back later.
			// otherwise use remove() and free up some memory.
			var i = this.parent._children.indexOf(this);
			this.parent._children.splice(i, 1);
			if (this.isInteractive) {
				i = this.ctx._interactives.indexOf(this);
				this.ctx._interactives.splice(i, 1);
			}
			this.parent=null;
			// we need to give this object the ability to be reborn
			// in order to do this we need it to appear dead
			// this will allow it to have new parents, and to inherit from them.
			this.live=false;
			this._default_inheritence();
		},
		// addChildAt,,, there is no need for addChildAt, you simply change the z of the child, and that will sort the order.
		// ill get rid of this eventualy, since it needs to be depricated. however other functions currently call on it.
		// addChildAt: function(child, depth) {
		// 	if (!this._children) {
		// 		this._children = [];
		// 	}

		// 	child.parent = this;
		// 	child.ctx = this.ctx;
		// 	// if (depth > this._children.length || depth < 0) {
		// 	// 	console.warn('Child Index(' + depth + ') out of bounds');
		// 	// 	depth = this._children.length;
		// 	// }
		// 	// for (var i = depth, length = this._children.length - 1; i < length; i++) {
		// 	// 	this._children[i] = this._children[i + 1];
		// 	// }
		// 	//console.log('new add')
		// 	this._children[this._children.length]=child
		// 	this._order();
		// 	return child;
		// },
		addChild: function(child) {
			//DUBUG if (arguments.length>1) console.warn('You can only add one child at a time using .addChild, use .addChildren instead. ('+this.name+')');
			if (!this._children) {
				this._children = [];
			}
			child.parent = this;
			child.ctx = this.ctx;
			this._children[this._children.length]=child
			this._order();
			return child;
		},
		addChildren: function(arr){
			for (var i=0;i!=arguments.length;i++){
				this.addChild(arguments[i]);
			}
		},
		getChildByName: function(name) {
			var children = this._children;
			var length = children.length;
			for (var i = 0; i != length; i++) {
				if (children[i].name === name) return children[i];
			}
			return null;
		},
		orbitXY : function() {
			var x = this.x;
			var y = this.y;
	
			var sin = Math.sin;
			var cos = Math.cos;
			var angle = this.angle*this.orbitSpeed;
			this._orbitX = (x * cos(angle)) - (y * sin(angle));
			this._orbitY = (x * sin(angle)) + (y * cos(angle));
		},
		_update: function(a) {
			if (this.receiveRotation) {
				this._rotate = this.rotate + a._rotate;
			} else {
				this._rotate = this.rotate;
			}
			this._scaleX = this.scaleX * a._scaleX;
			this._scaleY = this.scaleY * a._scaleY;
			this._speed = this.speed * a._speed;
			this._width = this.width * this._scaleX;
			this._height = this.height * this._scaleY;
			this._radius = this.radius * this._scaleY;
			if (a._visible==false){
				this._visible=false;
			}else{
				this._visible=this.visible;
			}
			if (this._rotate) {
				this.angle = (this._rotate / 180 * 3.14159265);
				this._angle= this.angle + a._angle;
			}
			this._alpha = this.alpha * a._alpha;
			
			if (this.orbit) {
				this.orbitXY();
			}else{
				this._orbitX=this._orbitY=0;
			}
			if (this._orbitX || this._orbitY) {
				this._x = ((this._orbitX)* a._scaleX) + (a._x);
				this._y = ((this._orbitY) * a._scaleY) + (a._y);
			} else {
				this._x = ((this.x)* a._scaleX) + (a._x);
				this._y = ((this.y)* a._scaleY) + (a._y);
			}
		},
		_simpleUpdate: function() {
			this._rotate = this.rotate;
			this._scaleX = this.scaleX*this.parent._scaleX;
			this._scaleY = this.scaleY*this.parent._scaleY;
			this._speed = this.speed
			this._width = this.width
			this._height = this.height
			this._radius = this.radius
			this._x = this.x;
			this._y= this.y;
			this._alpha = this.alpha
		},
		_default_inheritence: function(){
			this._x = this._y = this._width = this._height = this._scaleX = this._scaleY = 1;
			this._rotate = this._angle = this._orbitX = this._orbitY=0;
			this._speed = this._alpha = 1;
			this._radius = .5;
		},
		preRender : function(){
			if (this.visible && this.onEnterFrame) this.onEnterFrame(this.ctx.frameRatio * this._speed);
		
			if(this.parent.type!=='Studio.Stage'){
				this._update(this.parent);
			}else{
				this._update(this.parent);
				//this._simpleUpdate();
			}

			if(this.tween){
				for (var j in this.tween) {
					this.tween[j]();
				}
			}
		},
		renderChildren : function(){
			if (this._children) {
				var length = this._children.length;
				var i = length;
				while (i) {
					//we might have removed this child at some point, we should check before we try to render him.
					if(this._children[length - i]) this._children[length - i].render();
					i--;
				}
			}
		},
		postRender : function(){
			this.renderChildren();
			if (this.visible && this.onExitFrame) this.onExitFrame(this.ctx.frameRatio * this._speed);
		},
		render : function() {
			this.preRender();
			
			// if we did anything our drawing code would go in here.
			
			this.postRender();
		},

		// 
		makeInteractive: function(){
			if (!this.ctx._interactives) {
				this.ctx._interactives = [];
			}
			this.ctx._interactives.push(this);
		},
		_destroy: function() {
			for (var i in this) {
				delete this[i];
			}
		},
		_order: function() {
			function z_index(a, b) {
				if (a.z < b.z) return -1;
				if (a.z > b.z) return 1;
				return 0;
			}
			this._children.sort(z_index);
		},
		_responsive: function(){
			if (!this.ctx._responders) {
				this.ctx._responders = [];
			}
			this.ctx._responders.push(this);
		},
		_init: function() {
			this.ctx = this.parent.ctx;
			this.live = true;
			if (this.isInteractive) {
				this.makeInteractive();
			}
			if (this.isResponsive) {
				this._responsive();
			}
			this._update(this.parent);
			if (this.onReady) this.onReady();
		},
		// _statusCheck: function(){
		// 	// We don't want to init the object until its ready to be drawn on the screen.
		// 	// This allows us to add items in any order without concern for parents or a Canvas existing.
		// 	// This I admit may seem strange, and i'm not sure I like it. However it does make it possible
		// 	// to move an entire entity from one canvas to another, simply by changing its live status when
		// 	// moving the object.
		// 	if (!this.live) this._init();
		// },
		
		constructor : _s.DisplayObject
	};
	

	



	_s.DisplayObject.prototype.get = _s.DisplayObject.prototype.getChildByName;
	
	return _s;
});







/*
//http://jsperf.com/canvas-transforms

var Matrix = function () {
    this.m00 = 1;
    this.m01 = 0;
    this.m02 = 0;
    this.m10 = 0;
    this.m11 = 1;
    this.m12 = 0;
}
Matrix.prototype.translate = function (x, y) {
    this.m02 += this.m00*x + this.m01*y;
    this.m12 += this.m11*y + this.m10*x;
}
Matrix.prototype.scale = function (x, y) {
    this.m00 *= x;
    this.m10 *= x;
    this.m11 *= y;
    this.m01 *= y;
}
Matrix.prototype.rotate = function (angle) {
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    var t00 = this.m00*cos + this.m01*sin;
    var t01 = -this.m00*sin + this.m01*cos;
    this.m00 = t00;
    this.m01 = t01;

    var t10 = this.m11*sin + this.m10*cos;
    var t11 = this.m11*cos - this.m10*sin;
    this.m10 = t10;
    this.m11 = t11;
}


*/



