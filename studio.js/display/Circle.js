define(['display/Shape'], function(_s) {
	_s.Circle = function(name) {
		this.name = name || 'shape-rect';
		this._children = null;
		this.orbitSpeed = 1;
		this.color = 'green';
		this.radius = 0.5;
		this.rotate = 0;
	};

	_s.Circle.prototype = new _s.Shape();
	_s.Circle.prototype.constructor = _s.Circle;
	_s.Circle.prototype.type = 'Studio.Circle';

	_s.Circle.prototype.drawBasic = function() {
		var s = this.ctx;
		s.globalAlpha = this._alpha;
		var radius = this._radius
		var x = this._x;
		var y = this._y;
		if (_s.snapToPixel) {
			x = this._x + (this._x < 0 ? -1 : 0) | 0;
			y = this._y + (this._y < 0 ? -1 : 0) | 0;
		}
		s.fillStyle = this.color;
		s.beginPath();
		s.arc(x, y, radius, 0, 7, false);
		s.fill();
	};

	_s.Circle.prototype.render = function() {
		if(this.ctx){
			this.preRender();
			if (this.visible) {
				this.drawBasic();
				this.postRender();
			}
		}else{
			this._statusCheck();
		}
	};
	
	// basic concept taken from http://stackoverflow.com/a/402010/1922609
	_s.Circle.prototype.hitTestRect = function(b) {
		var distance_x = Math.abs(this._x - b._x);
		var distance_y = Math.abs(this._y - b._y);

		if (distance_x > (b._width/2 + this.radius)) return false;
	    if (distance_y > (b._height/2 + this.radius)) return false;
	    if (distance_x + this.radius <= (b._width/2 + this.radius)) return true;
	    if (distance_y + this.radius <= (b._height/2 + this.radius)) 	return true;

	    var corner = ((distance_x - b._width/2)*(distance_x - b._width/2)) + ((distance_y - b._height/2)*(distance_y - b._height/2));
		return (corner <= (this.radius * this.radius ));
	}

	return _s;
});

