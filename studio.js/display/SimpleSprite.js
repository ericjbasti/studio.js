define(['display/Shape', 'display/Image'], function(_s) {

	_s.Sprite = function(name) {
		this.name = name || null;
		this._children = null;
		this.frame = 0;
		this.fps = 12;
		this.speed = 1;
		this.sequence = [];
		this.sequences = null;
		this.loop = true;
		this.status = null;
		this.bitmap = null;

		this.setStartingFrame(0);
	};

	_s.Sprite.prototype = new _s.Shape();
	_s.Sprite.prototype.constructor = _s.Sprite;
	_s.Sprite.prototype.type = 'Studio.Sprite';

	_s.Sprite.prototype.setStartingFrame = function(a) {
		this.frame = a;
		this.startTime = Date.now();
		this.myTime = this.startTime + (a * (1000 / this.fps));
	};

	_s.Sprite.prototype.updateFrame = function() {
		this.myTime += this.ctx.timeDelta;

		this.frame = (((this.myTime - this.startTime) * this._speed) / (1000 / this.fps)) | 0;

		if (this.frame >= this.sequence.length) {
			this.startTime = this.myTime;
			this.frame = 0;
			if (this.onSequenceComplete) this.onSequenceComplete.call(this);
		}
	};

	_s.Sprite.prototype.draw = function() {
		var s = this.ctx;
		s.save();
		s.globalAlpha = this._alpha;

		//s.translate(this._x, this._y);
		//s.rotate(this._angle || 0);
		//s.scale(this._scaleX, this._scaleY);

		s.transform(this.m00, this.m10, this.m01, this.m11, this.m02, this.m12);
		if (this.bitmap && this.bitmap.bitmapLoaded) {
			var rectX2 = this.bitmap.frameRect.x2;
			var rectY2 = this.bitmap.frameRect.y2;
			var sheetWidth = this.spriteSheetX || 1;
			var frame = this.sequence[this.frame] || 0;
			var sheetY = frame + (frame < 0 ? -1 : 0) | 0;
			var sheetX = (frame - sheetY) * sheetWidth;
			s.drawImage(
			this.bitmap.image,
			rectX2 * sheetX, rectY2 * sheetY, rectX2, rectY2,
			-this.width * this.anchorX,-this.height * this.anchorY,
			this.width, this.height);
			this.updateFrame();
		}

		s.restore();
	};

	_s.Sprite.prototype.drawBasic = function() {
		//var a= this;
		var s = this.ctx;
		s.globalAlpha = this._alpha;

		var width = this.width;
		var height = this.height;
		var x = this._x;
		var y = this._y;

		if (_s.snapToPixel) {
			x = this._x + (this._x < 0 ? -1 : 0) | 0;
			y = this._y + (this._y < 0 ? -1 : 0) | 0;
			height = height + (height < 0 ? -1 : 0) | 0;
			height = height + (height < 0 ? -1 : 0) | 0;
		}

		if (this.bitmap && this.bitmap.bitmapLoaded) {
			var frame = this.sequence[this.frame] || 0;
			var sheetY = frame + (frame < 0 ? -1 : 0) | 0;
			var sheetX = (frame - sheetY) * this.spriteSheetX || 0;

			s.drawImage(this.bitmap.image, this.bitmap.frameRect.x2 * sheetX, this.bitmap.frameRect.y2 * sheetY, this.bitmap.frameRect.x2, this.bitmap.frameRect.y2, x - (width * this._scaleX) * this.anchorX, y - (height * this._scaleX) * this.anchorY, width * this._scaleX, height * this._scaleY);

			this.updateFrame();
		}

	};

	_s.Sprite.prototype._statusCheck= function(){
		if (!this.live) this._init();
		this.live = true;
		if (this.bitmap && this.bitmap.bitmapLoaded){
			if(this.onBitmapLoad){
				this.onBitmapLoad();
				delete this['onBitmapLoad'];
			}
		}
	}


	return _s;
});