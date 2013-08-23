define(['studio'],function(Studio){

Studio.audioCTX= new webkitAudioContext();


Studio.Sound=function(path){
	this.snd;
	this.ready=false;
	if(path){
		this.load(path);
	}
}


Studio.Sound.prototype.constructor = Studio.Sound;


Studio.Sound.prototype.load=function(who){
	if(!Studio.assets[who]){
		var ctx=Studio.audioCTX;
		var request = new XMLHttpRequest();
		request.open('GET', who, true);
		request.responseType = 'arraybuffer';
		Studio.assets.length++;
		var me=this;
		request.onload = function(){
			ctx.decodeAudioData(request.response,function(buffer){
				Studio.queue++;
				Studio.assets[who]=buffer;
				me.snd=Studio.assets[who];
				me.ready=true;
				me.init();
				if(Studio.queue===Studio.assets.length){
					Studio.loaded=true;
				}
			});
			
		}
		request.send();
	}else{
		this.snd=Studio.assets[who];
		this.ready=true;
		this.init();
	}
}

Studio.Sound.prototype.init=function(){
	this.source = Studio.audioCTX.createBufferSource();
}

Studio.Sound.prototype.play=function(){
	if (this.ready){
		this.source.buffer = this.snd;
		this.source.connect(Studio.audioCTX.destination);
		this.source.noteOn(0);
		return this;
	}
}
Studio.Sound.prototype.volume=function(val){
	if (this.ready){
		this.source.gain.value=val;
		return this;
	}
}
Studio.Sound.prototype.playbackRate=function(val){
	if (this.ready){
		this.source.playbackRate.value=val;
		return this;
	}
}
Studio.Sound.prototype.loop=function(val){
	if (this.ready){
		this.source.loop=val;
		return this;
	}
	
}
return Studio;
});