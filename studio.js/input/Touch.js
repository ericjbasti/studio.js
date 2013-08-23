
define(['display/Stage'],function(Studio){
Studio.Stage.prototype.updateMouseStatus = function(down,x,y,x2,y2) {
	if(this.ctx._interactives){
		for (var i = 0; i != this.ctx._interactives.length; i++) {
			this.ctx._interactives[i].isTouched=false;
			var hit=this.ctx._interactives[i].hitTestPoint(x,y);
			if(hit) {
				this.ctx._interactives[i].isTouched=true;
				if(this.ctx._interactives[i].touched) this.ctx._interactives[i].touched(down,x,y,x2,y2);
			}
		}
	}
}
Studio.Stage.prototype.updateGestureStatus = function(active,x,y,s,r) {
	if(this.ctx._interactives){
		for (var i = 0; i != this.ctx._interactives.length; i++) {
			this.ctx._interactives[i].isTouched=false;
			var hit=this.ctx._interactives[i].hitTestPoint(x,y);
			
				this.ctx._interactives[i].isTouched=true;
				if(this.ctx._interactives[i].gesture) this.ctx._interactives[i].gesture(active,x,y,s,r);
			
		}
	}
}

Studio.Stage.prototype.enableTouchEvents= function(){
	var me = this;
	
	this.mouseDown = false;
	this.mouseMove = false;
	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseXdelta = 0;
	this.mouseYdelta = 0;
	
	this.resetXY=function(event){
		me.mouseX = event.clientX*me.resolution;
		me.mouseY = event.clientY*me.resolution;
		me.mouseXdelta = 0;
		me.mouseYdelta = 0;
	}
	
	this.updateXY=function(event){
		var newX = event.clientX*me.resolution;
		var newY = event.clientY*me.resolution;
		me.mouseXdelta = me.mouseX-newX;
		me.mouseYdelta = me.mouseY-newY;
		me.mouseX = newX;
		me.mouseY = newY;	
	}
	
	this.onPressEvent = function(event) {
		event.preventDefault();
		switch(event.type){
			case "mousemove" : 
				me.updateXY(event);
				break;
			case "mouseup" : 
				me.mouseDown = false;
				break;
			case "mouseout" : 
				me.mouseDown = false;
				break;
			case "mousedown" :
				me.mouseDown = true;
				me.resetXY(event);
				break;
			case "touchstart" :
				me.mouseDown = true;
				me.resetXY(event.targetTouches[0]);
				break;
			case "touchmove" :
				me.mouseDown = true;
				me.updateXY(event.targetTouches[0]);
				break;
			case "touchend" :
				me.mouseDown = false;
				break;
		}
		me.updateMouseStatus(me.mouseDown, me.mouseX, me.mouseY, me.mouseXdelta, me.mouseYdelta);
	};
	var scale=1;
	this.onGestureEvent = function(event){
		var active=!event.type=="gestureend";
		scale=1+((event.scale-scale)/31);
		me.updateGestureStatus(active, event.clientX, event.clientY, scale, event.rotation);
	}
	this.mouseWheel= function(event){
		event.preventDefault();
		if(event.type=="DOMMouseScroll"){

			me.updateGestureStatus(false,0,0,(event.detail)*-.05,0);
		}else{
			me.updateGestureStatus(false,0,0,1+(event.wheelDelta/241),0); 
		}
	}
	
	this.canvas.onmousedown = this.onPressEvent;
	this.canvas.onmouseup = this.onPressEvent;
	this.canvas.onmouseout = this.onPressEvent;
	this.canvas.onmousemove = this.onPressEvent;
	this.canvas.ontouchstart = this.onPressEvent;
	this.canvas.ontouchmove = this.onPressEvent;
	this.canvas.ontouchend = this.onPressEvent;
	this.canvas.ongesturestart = this.onGestureEvent;
	this.canvas.ongesturechange = this.onGestureEvent;
	this.canvas.ongestureend = this.onGestureEvent;
	this.canvas.onmousewheel = this.mouseWheel;
	// hi im firefox, and i want to be difficult
	this.canvas.addEventListener("DOMMouseScroll", this.mouseWheel, false);

	this.canvas.setAttribute('tabindex','0');
	this.canvas.focus();
	
}


return Studio;
});

