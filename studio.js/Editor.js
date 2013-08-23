define(['display/Stage'],function(Studio){


var timeline=document.getElementById('timeline');

Studio.Stage.prototype.updateFPS = function() {
	var then = this.ctx.then;
	var now = timeline.value;
	var delta = now - then;
	this.ctx.timeDelta = delta * this.speed;
	this.ctx.then = now;
	this.ctx.frameRatio = 60 / (1000 / delta);
}


return Studio;
});