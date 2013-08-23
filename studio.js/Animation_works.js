define(['Ease','display/Shape'],function(Studio){
Studio.Animation=function(){
	this.keys=[];
	this.cur=0;
	return this;
}

Studio.Animation.prototype.type="Studio.Animation";
Studio.Animation.constructor=Studio.Animation;

Studio.Animation.prototype.addKeyFrame=Studio.Animation.prototype.key=function(ease,properties,duration){
	this.keys.push({ease:ease,props:properties,duration:duration});
	return this;
}

Studio.Animation.prototype.addPause= Studio.Animation.prototype.pause=function(duration){
	this.keys.push({ease:'none',props:{},duration:duration});
	return this;
}
Studio.Animation.prototype.setFrame=Studio.Animation.prototype.set=function(obj){
	this.keys.push({ease:'none',props:obj,duration:0});
	return this;
}
Studio.Animation.prototype.action=function(act){
	this.keys.push({type:'action',action:act});
	return this;
}

Studio.Animation.prototype.play=function(who){
	this.start=0;
	this.step(who);
}

Studio.Animation.prototype.step= function(who){
	var me=who;
	var t=this;
	var k=this.keys[this.cur];
	if (k.type=='action'){
		k.action.call(me);
		t.cur++;
		if(t.cur>=t.keys.length) t.cur=0;
		t.step(who);
	}else{
		who.addTween(k.ease,k.props,k.duration,function(me){
			t.cur++;
			if(t.cur>=t.keys.length) t.cur=0;
			t.step(who);
		})
	}
}


// Animation

Studio.Shape.prototype.setAnimation=function(what){
	this.animation={};
	this.animation.cur=0;
	this.animation.keys=what.keys;
}

Studio.Shape.prototype.play=function(){
	this.start=0;
	this.step();
}

Studio.Shape.prototype.step=function(){

	var me=this;
	var t=me.animation;
	var k=t.keys[t.cur];
		this.addTween(k.ease,k.props,k.duration,function(){
			t.cur++;
			if(t.cur>=t.keys.length) t.cur=0;
			me.step();
		})
}

return Studio;
});






//Timeline.prototype.applyValues = function() {  
//	for(var i=0; i<this.anims.length; i++) { 
//		var propertyAnim = this.anims[i];               			
//		if (this.time < propertyAnim.startTime) {
//			continue;
//		} 
		//if start time happened during last frame
		
//		if (this.prevTime <= propertyAnim.startTime && propertyAnim.startTime <= this.time) {      		  
//		  	propertyAnim.startValue = propertyAnim.target[propertyAnim.propertyName]; 
//		}                                       
//		if (this.prevTime <= propertyAnim.endTime && propertyAnim.endTime <= this.time) {  
//	    	propertyAnim.target[propertyAnim.propertyName] = propertyAnim.endValue;   		  
//			continue;
//		}        		                                                                               
//		if (propertyAnim.endTime - propertyAnim.startTime == 0) {
//		  continue;
//		}
//		var t = (this.time - propertyAnim.startTime)/(propertyAnim.endTime - propertyAnim.startTime);					                                  			 			
//		t = propertyAnim.easing(t);
//		t = Math.max(0, Math.min(t, 1));                                                                          		
//		propertyAnim.target[propertyAnim.propertyName] = propertyAnim.startValue + (propertyAnim.endValue - propertyAnim.startValue) * t;			
//	}
//}  