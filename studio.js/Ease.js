define(['display/DisplayObject'],function(_s){

_s.DisplayObject.prototype.addTween=function(t,a,d,next,del){

//	if a tween doesn't exist lets create a tween object
	if(!this.tween) this.tween={};
	//this._init();
	var w=this;
	var start= this.ctx.now;
	var cur=0;
//	we need to store the original values so we can calculate the difference.
	var original={};
	for (var j in a){
		original[j]=w[j];
	}
	
//	we need to uniquely identify the tween so we can delete it once done.
	var name='tween_id'+((Math.random()*255255255) | 0);
	
	this.tween[name]=function(){
		cur+=((w.ctx.timeDelta)*w._speed);

		if(d>=cur){
			for (var i in a){
				w[i]=_s.ease[t](cur,original[i],a[i]-original[i],d);
			}
		}else{
//			now that the full time has lapsed, lets make 100% we got to the final values
			for (var i in a){
				w[i]=a[i];
			}
//			if we have a callback lets fire that now, otherwise lets move on.
			if(next) next.call(w);
			
//			and now for the suicide. this tween will destroy itself, thus preventing the
//			tween from taking up anymore render cycles.
			if(w.tween) delete w.tween[name];
		}
		
	};
	
	return this;
}

_s.DisplayObject.prototype.addTweenLine= function(t,a,d,next){
	this.addTween(t,a,d,next,true);
}


//t: current time, 
//b: beginning value, 
//c: change in value, 
//d: duration


_s.ease={
	none:function(t, b, c, d) {
		return b;
	},
	linear :function(t, b, c, d) {
		return c*t/d + b;
	},
	easeIn :function(t, b, c, d){
		return c*(t/=d)*t + b;
	},
	easeOut : function (t, b, c, d) {
		t /= d;
		return -c * t*(t-2) + b;
	},
	easeInOut :function(t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t + b;
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	},
	easeOutBounce : function (t, b, c, d) {
		if ((t/=d) < (.36363636363636365)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (.7272727272727273)) {
			return c*(7.5625*(t-=(.5454545454545454))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(.8181818181818182))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(.9545454545454546))*t + .984375) + b;
		}
	},
	easeInBack : function (t, b, c, d) {
		var s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack : function (t, b, c, d) {
		var s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack : function (t, b, c, d) {
		var s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}
};

return _s;
});