define(['display/Stage'],function(_s){

_s.Stage.prototype.setLoader = function(loader) {
	loader.ctx = this.ctx;
	loader.parent = this;
	this._loader = loader;
	return loader;
};

_s.Loader = function(name) {
	this.name = name || null;
	this._children = null;
	this.frame = 0;
	this.fps = 12;
	this.speed=1;
	this.progress = 0;
}

_s.Loader.prototype = new _s.DisplayObject();
_s.Loader.prototype.constructor = _s.Loader;
_s.Loader.prototype.type = 'Studio.Loader';



_s.Loader.prototype.render = function(progress) {
	this.preRender();
	this.progress=progress;
	this.postRender();
};




return _s;
});