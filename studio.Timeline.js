Studio.visualEdit = function(who){
	this.editor=document.getElementById(who);
	
	this._templates={};
	
	this._templates.dragbar='<div class="drag-bar"><div class="start"></div><div class="info-block" style="background-image:url(%image%)"></div><div class="title-info" style="color:%color%">%name%</div><div class="end"></div></div>';
	
	this._templates.visualBox='<div style="background-image:url(%image%)"></div>';
	
}

Studio.visualEdit.prototype.fillTemplate = function(who,where){
	var temp=who;
	for (var i in where){
		temp=temp.replace(i,where[i]);
	}
	return temp;
}

Studio.visualEdit.prototype.build=function(who){
	var cast= who.cast;
	for (var i in cast){
		this.editor.innerHTML+=this.fillTemplate(this._templates.dragbar,{"%name%":i,"%image%":cast[i].img.src});
	}
}
Studio.visualEdit.prototype.constructor = Studio.visualEdit;



Studio.Timeline = function(obj) {
	this.timeline = obj || {};
	this.type = 'Studio.Timeline';
	return this.build();
}

Studio.Timeline.prototype.build=function(){
	var stage=new Studio.Stage(this.timeline.canvas);
	for (var i in this.timeline.stage){
		stage[i]=this.timeline.stage[i];
	}
	for (var i in this.timeline.cast){
		var castmember = stage.addChild(new Studio.Sprite(i));
		if(this.timeline.cast[i].img){
			var img=this.timeline.cast[i].img;
			castmember.loadBitmap(img.src,img.width,img.height);
		}
		for (var j in this.timeline.cast[i]){
			castmember[j] = this.timeline.cast[i][j];
		}
	}
	console.log(stage);
	stage.loop()
}

Studio.Timeline.prototype.printType = function() {
	return this.type;
}

Studio.Timeline.prototype.constructor = Studio.Timeline;


Studio.Timeline.prototype.drawObject= function(who){
	
}