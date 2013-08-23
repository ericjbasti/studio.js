define(['studio'],function(Studio){

Studio.audioCTX= new webkitAudioContext();

Studio.loadSound=function(who){
	if(!Studio.assets[who]){
		var ctx=Studio.audioCTX;
		var request = new XMLHttpRequest();
		request.open('GET', who, true);
		request.responseType = 'arraybuffer';
		Studio.assets.length++;
		
		function onError(e){
			console.log(e);
		}
		request.onload = function(){
			ctx.decodeAudioData(request.response,function(buffer){
				console.log(buffer);
				Studio.queue++;
				Studio.assets[who]=buffer;
				if(Studio.queue===Studio.assets.length){
					Studio.loaded=true;
				}
			});
			
		}
		request.send();
	}
}

Studio.play=function(who,volume){
	var source = Studio.audioCTX.createBufferSource();
	source.buffer = this.assets[who];
	source.connect(Studio.audioCTX.destination);
	source.buffer.gain=volume||1;
	source.noteOn(0);
	return this;
}


return Studio;
});