define(['display/Image'],function(Studio){

	Studio.SpriteSheet=function(path){
		this.image=null;
		this.path=path || '';
		this.ready=false;
		this.assets = null;
		if(path){
			this.loadJSON(path);
		}
	};


	Studio.SpriteSheet.prototype = new Studio.Image();
	Studio.SpriteSheet.prototype.constructor = Studio.SpriteSheet;
	Studio.SpriteSheet.prototype.type = 'Studio.SpriteSheet';


	Studio.SpriteSheet.prototype.loadJSON = function(path){
		if (Studio.assets[path]) {

		}else{
			Studio.assets.length++;
			var file = new XMLHttpRequest();
			var sheet = this;
	    	file.open("GET", path, true);
	    	file.onreadystatechange = function() {
		    	if (this.readyState != 4){ 
		    		return; 
		    	}
		    	if(this.response){
		    		sheet.assets=JSON.parse(this.response);
		    		Studio.queue++;
		    		sheet.image= new Studio.Image('imgs/untitled.png');
		    	}
	    	};
	   		file.send(null)
   		}
	}

	Studio.SpriteSheet.prototype.get = function(who){
		return(this.assets.frames[who].frame);
	}

	return Studio;
});