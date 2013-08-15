define(['display/DisplayObject'],function(Studio){

	Studio.Image=function(path,width,height){
		this.image=new Image();
		this.path=path || '';
		this.ready=false;
		this.height=height;
		this.width=width;
		this.frameRect = {
			x1: 0,
			y1: 0,
			x2: width,
			y2: height
		};
		if(path){
			this.loadImage(path);
		}
	};

	Studio.Image.prototype.setFrameSize = function(width,height){
		this.frameRect.x2=width;
		this.frameRect.y2=height;
	};

	Studio.Image.prototype.loadImage = function(who) {
		if (Studio.assets[who]) {
			this.image = Studio.assets[who];
			this.path=who;
			this.ready = true;
			if(this.onLoadComplete) this.onLoadComplete();
			return this;
		} else {
			//if (!Studio.loadOnDemand) Studio.loaded=false;
			Studio.loaded=Studio.loadOnDemand;
			Studio.assets[who] = new Image();
			Studio.assets.length++;
			var first=this;
			Studio.assets[who].onload = function(e) {
				Studio.queue++;
				first.ready=true;
				first.path=who;
				console.log('loaded')
				if (!first.height) first.height=this.height;
				if (!first.width) first.width=this.width;
				if (!first.frameRect.y2) first.frameRect.y2=this.height;
				if (!first.frameRect.x2) first.frameRect.x2=this.width;
				
				if(Studio.queue===Studio.assets.length){
					Studio.loaded=true;
				}
				if(first.onLoadComplete) first.onLoadComplete();
				return first;
			};
			Studio.assets[who].src = who;
			this.image = Studio.assets[who];
		}
	};

	Studio.Image.prototype.constructor = Studio.Image;


	// helper function to build sprite sheets based on an array.
	//	[0][1][2][3]
	// 	[4][5][6][7]
	//  var sheet = [0,1,2,3,4,5,6,7];
	//
	// 	you would pass into buildSheet with a width of 6 
	// 	studio.buildSheet(sheet,4)
	//	the result is:
	// 					[0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75]
	//
	//	this is done to make sheets take up less memory.
	//	otherwise we would need to store the sheet as an array of arrays (or objects)
	// 	you can see that the value before the decimal tells us the 'y' value and
	//	the value after the decimal tells us the 'x' value (in a width of 4).
	//	you really don't need to know this, other than the format your original array
	// 	should be sent in.

	Studio.buildSheet=function(who,width){
		for (var i=0;i!=who.length;i++){
			who[i]=who[i]/width;
		}
	}

	return Studio;
});