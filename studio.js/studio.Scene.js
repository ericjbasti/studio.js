// Ok concept time, so we can actually build this. What im thinking it should do is exactly what it does now. ONly lets not call it oncomplete, lets call it nextKeyframe.
// so move dot from 1(keyframe-0 value)->15(keyframe-1 value) linearly for 3 seconds, then lets go to keyframe[2]
// keyframeIndex=0;
// keyframes:[
// 		0:{x:0,y:0},
//		1:{x:100,y:200,easings:{x:'linear',y:'linear'},duration:3000},
//		2:{x:200,easings:{x:'linear'},duration:2000}
//]
//
//

Studio.Scene=function(obj){
	if(!obj) var obj={};
	this.cast=obj.cast || {};
	this.timeline=[];
	this.keyframes=obj.keyfames||12;
	this.length=obj.length||10;
	this.stage=null;
	
	this.init(obj.timeline||null);
}

Studio.Scene.prototype.constructor = Studio.Scene;

Studio.Scene.prototype.init =function(timeline){
	var i;
	this.timeline.length=this.length*this.keyframes;
	if(timeline){
	
	}else{
		for (i=0;i!=this.timeline.length;i++){
			this.timeline[i]=null;
		}
	}
}

Studio.Scene.prototype.JSONifyScene = function(){
	var temp={};
	
	temp.cast=this.cast;
	temp.keyframe=this.keyframes;
	temp.length=this.length;
	
	return(JSON.stringify(temp));
}



Studio.CastMember=function(obj){
	this.name=obj.name || "noname";
	this.type=obj.type || "Studio.DisplayObject";
	
}

Studio.CastMember.prototype.constructor = Studio.CastMember;