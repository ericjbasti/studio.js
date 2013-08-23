define(['display/Shape'], function(Studio) {

	Studio.Vector = function(obj) {
		this.name = name || null;
		this.vector = obj || {};
		this.cache = null;
	};

	Studio.Vector.prototype = new Studio.Shape();
	Studio.Vector.prototype.constructor = Studio.Vector;
	Studio.Vector.prototype.type = 'Studio.Vector';

	Studio.Vector.prototype.draw = function() {
		var ctx = this.ctx;

		ctx.save();
		ctx.globalAlpha = this._alpha;
		ctx.translate(this._x, this._y);
		ctx.rotate(this._angle || 0);
		ctx.scale(this._scaleX, this._scaleY);
		var cache=this.cache;
		
		if(!cache){
			this.vector(ctx);
		}else{
			ctx.drawImage(
			cache, 0, 0, cache.width, cache.height, -cache.width * this.anchorX, // we've already translated, no need to move again
			- cache.height * this.anchorY, cache.width, cache.height);
		}
		ctx.restore();
	}

	Studio.Vector.prototype.cacheAsBitmap = function(width,height){
		this.cache= document.createElement('canvas');
		this.cache.width = width || 512;
		this.cache.height = height || 512
		var ctx= this.cache.getContext('2d');
		this.vector(ctx);
	}
	
	Studio.Vector.prototype.render = function() {
		this.preRender();
		this.draw();
	};
	return Studio;
});