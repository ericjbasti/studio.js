define(['display/DisplayObject',''],function(Studio){
	Studio.Camera = function(name,to) {
		this.ctx=to;
		this.resolution = 1;
		this.offsetX=to.width/2;
		this.offsetY=to.height/2;
		this._speed=1;
		// to a camera an anchor point would be another display object. an object to follow.
		this.anchor=null;
		this.name = name || null;
	}
	
	Studio.Camera.prototype = new Studio.DisplayObject();
	Studio.Camera.prototype.constructor = Studio.Camera;
	Studio.Camera.prototype.type = 'Studio.Camera';
	
	// camera has an issue with rotating/orbiting follows... im working on it.. maybe
	// i want this to work. but its going to require completely changing how the cameras work.
	// the inheritance it really screwing things up
	Studio.Camera.prototype.follow =function(who){
		this.anchor=who;
	}
	
	Studio.Camera.prototype.panTo = function(x,y,time){
		this.addTween('easeInOut',{y:-y,x:-x},time);
	}
	Studio.Camera.prototype.panHorizontal = function(x,time){
		var x=this.x-x
		this.addTween('easeInOut',{x:x},time);
	}
	Studio.Camera.prototype.panVertical = function(y,time){
		var y=this.y-y
		this.addTween('easeInOut',{y:y},time);
	}
	
	Studio.Camera.prototype.zoom = function(x,time){
		this.addTween('easeInOut',{scaleX:x,scaleY:x},time);
	}
	
	Studio.Camera.prototype.update = function(){
		for (var j in this.tween){
			this.tween[j]();
		}
		if(this.anchor){
			this.x=(-this.anchor.x*this.scaleX)+this.offsetX;
			this.y=(-this.anchor.y*this.scaleY)+this.offsetY;
		}
	}
return Studio;
});