define(['display/DisplayObject'], function(_s) {
	_s.Shape = function(name) {
		this.name = name || 'shape-rect';
		this._children = null;
		this.orbitSpeed = 1;
		this.color = 'red';
		return this;
	};

	_s.Shape.prototype = new _s.DisplayObject();
	_s.Shape.prototype.constructor = _s.Shape;
	_s.Shape.prototype.type = 'Studio.Shape';

	// Note to self:
	// Check to see if you need to s.scale it now that you store the _width and _height pre scaled.
	// you might be able to save a command by changing this.
	_s.Shape.prototype.draw = function() {
		var s = this.ctx;
		s.save();
		if(s.globalAlpha!=this._alpha) s.globalAlpha = this._alpha;
		s.translate(this._x, this._y);
		s.scale(this._scaleX, this._scaleY);
		s.rotate(this.angle || 0);
		s.fillStyle = this.color;
		s.fillRect(-(this.width*this.anchorX),-(this.height*this.anchorY), this.width, this.height);
		s.restore();
	};

	_s.Shape.prototype.drawBasic = function() {
		var s = this.ctx;
		if(s.globalAlpha!=this._alpha) s.globalAlpha = this._alpha;
		var width = this._width;
		var height = this._height;
		var x = this._x;
		var y = this._y;
		if (_s.snapToPixel) {
			x = this._x + (this._x < 0 ? -1 : 0) | 0;
			y = this._y + (this._y < 0 ? -1 : 0) | 0;
			height = height + (height < 0 ? -1 : 0) | 0;
			width = width + (width < 0 ? -1 : 0) | 0;
		}
		s.fillStyle = this.color;
		s.fillRect(x-(this._width*this.anchorX), y-(this._height*this.anchorY), width, height);
	};

	_s.Shape.prototype.render = function() {
		if(this.ctx && this.live){
			this.preRender();
			if (this._visible) {
				//we want to use the basic method as much as possible, transforms are slow...
				if (this._rotate === 0) {
					this.drawBasic();
				} else {
					this.draw();
				}
			}
			this.postRender();
		}else if(!this.live){
			this._init();
		}
	};



	// below are hit test snips... not required eventually



	_s.Shape.prototype.hitTestPoint = function(x, y) {
		var relativeX = x - this._x;
		var relativeY = y - this._y;

		if (this._rotate) {
			x = (relativeX * Math.cos(-this._angle)) - (relativeY * Math.sin(-this._angle));
			y = (relativeX * Math.sin(-this._angle)) + (relativeY * Math.cos(-this._angle));
			relativeX = x;
			relativeY = y;
		}
		var anchoredX = ((this.anchorX * this.width) * this._scaleX);
		var anchoredY = ((this.anchorY * this.height) * this._scaleY);

		//
		// Lets visualize the hit test... helped fix a bug or two ;) phew
		//
		//	var d=50;
		//	this.ctx.fillStyle='blue';
		//	this.ctx.fillRect(-anchoredX+d,-anchoredY+d, (this._scaleX * this.width),(this._scaleY * this.height));
		//
		//	this.ctx.fillStyle='green';
		//	this.ctx.fillRect(relativeX-3+d,relativeY-3+d,7,7);
		//

		if ((relativeX > -anchoredX && relativeY > -anchoredY) && (relativeX < (this._scaleX * this.width) - anchoredX && relativeY < (this._scaleY * this.height) - anchoredY)) {
			return (true);
		}

		return (false);
	};

	_s.Shape.prototype.hitTestCircle = function(obj) {
		var dx = this._x - obj._x;
		var dy = this._y - obj._y;
		var distance = (dx * dx) + (dy * dy);

		var area = (this.radius + obj.radius)*(this.radius + obj.radius);
		return (area / distance);
	};

	_s.Shape.prototype.hitTestCR = function(b) {
		var distance_x = Math.abs(this._x - b._x);
		var distance_y = Math.abs(this._y - b._y);

		if (distance_x > (b._width/2 + this._radius)) return false;
	    if (distance_y > (b._height/2 + this._radius)) return false;
	    if (distance_x + this._radius <= (b._width/2 + this._radius)) return true;
	    if (distance_y + this._radius <= (b._height/2 + this._radius)) 	return true;

	    var corner = ((distance_x - b._width/2)*(distance_x - b._width/2)) + ((distance_y - b._height/2)*(distance_y - b._height/2));
		return (corner < (this._radius * this._radius ));
	}

	_s.Shape.prototype.hitTestObject = function(b){
		this.hitTestRect(b);
	}
	_s.Shape.prototype.hitTestRectTL = function(b) {
		var difference = {};
		difference.x = this._x - b._x - b._width;
		difference.y = this._y - b._y - b._height;
		difference.height = this._height + b._height;
		difference.width = this._width + b._width;

		// Lets visualize the hit test... helped fix a bug or two ;) phew
		
			// var d=5;
			// this.ctx.fillStyle='rgba(255,1,0,.3)';
			// this.ctx.fillRect(difference.x+d,difference.y+d,difference.width,difference.height);
		
		
			// this.ctx.fillStyle='orange';
			// this.ctx.fillRect(d,d,1,1);

		if (difference.x < 0 && difference.y <= 0 && difference.height + difference.y >= 0 && difference.width + difference.x >= 0) return true;
		return false;
	};
	
	_s.Shape.prototype.hitTestRect = function(b) {
		var difference = {};
		//difference.x = this._x - b._x - b._width;
		//difference.y = this._y - b._y - b._height;
		difference.height = this._height + b._height;
		difference.width = this._width + b._width;
		
		difference.x=this._x-(this._width*this.anchorX)-b._x-(b._width*b.anchorX);
		difference.y=this._y-(this._height*this.anchorY)-b._y-(b._height*b.anchorY);

		// Lets visualize the hit test... helped fix a bug or two ;) phew
		
			// var d=5;
			// this.ctx.fillStyle='rgba(255,1,0,.3)';
			// this.ctx.fillRect(difference.x+d,difference.y+d,difference.width,difference.height);
		
		
			// this.ctx.fillStyle='orange';
			// this.ctx.fillRect(d,d,1,1);

		if (difference.x < 0 && difference.y <= 0 && difference.height + difference.y >= 0 && difference.width + difference.x >= 0) return true;
		return false;
	};


	return _s;
});

