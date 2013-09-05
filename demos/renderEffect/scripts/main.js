require.config({
	baseUrl: "../../studio.js",
	paths: {
		display: 'display'
	}
});

require(['display/Sprite', 'display/Vector', 'input/Touch','display/Loader', 'Animation'], function(studio) {
	// Asteroid Benchmark
	studio.snapToPixel=true;

	stage = new studio.Stage('stage');
	//stage.color='red'
	var rock= new studio.Image('imgs/24grey.gif',24,24);
	rock.onLoadComplete= function(){
		//this.applyEffect(studio.halftone);
	}

	butterfly = new studio.Image('imgs/abcBLUR.png');
	butterfly.onLoadComplete = function(){
		//this.applyEffect(studio.halftone);
	}
	studio.halftone = function(pixels) {
		var d = pixels.data;
		var width=(studio.buffer.width*4);
		for (var i=0; i<d.length; i+=4) {
			var oldpixel=(d[i]);
			var newpixel=parseInt(oldpixel/255)*255;
			d[i]=d[i+1]=d[i+2]=newpixel;
			var qerror = (oldpixel-newpixel)*(.18);
			if((i % width === 0) && (i+4 % width === 0)){
			
			}else{
				d[i+5]=d[i+6]=d[i+4]+=(qerror);
				d[i+9]=d[i+10]=d[i+8]+=(qerror);
				d[i+5+width]=d[i+6+width]=d[i+4+width]+=(qerror);
				d[i+1+width]=d[i+2+width]=d[i+width]+=(qerror);
				d[i+width-3]=d[i+width-2]=d[i+width-4]+=(qerror);
				d[i+width*2]=d[i+(width*2)]=d[i+(width*2)]+=(qerror);
			}
		}
		return pixels;
	};


	var rock_sheet = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
	studio.buildSheet(rock_sheet,24);

	studio.halftone = function(a) {
		var buffer=a.getImageData(0,0,a.width,a.height);
		var width=(a.width*4);
		for (var i=0; i<buffer.data.length; i+=4) {
			var oldpixel=(buffer.data[i]);
			var newpixel=parseInt(oldpixel/255)*255;
			buffer.data[i]=buffer.data[i+1]=buffer.data[i+2]=newpixel;
			var qerror = (oldpixel-newpixel)*(.18);
			if((i % width === 0) && (i+4 % width === 0)){
			
			}else{
				buffer.data[i+5]=buffer.data[i+6]=buffer.data[i+4]+=(qerror);
				buffer.data[i+9]=buffer.data[i+10]=buffer.data[i+8]+=(qerror);
				buffer.data[i+5+width]=buffer.data[i+6+width]=buffer.data[i+4+width]+=(qerror);
				buffer.data[i+1+width]=buffer.data[i+2+width]=buffer.data[i+width]+=(qerror);
				buffer.data[i+width-3]=buffer.data[i+width-2]=buffer.data[i+width-4]+=(qerror);
				buffer.data[i+width*2]=buffer.data[i+(width*2)]=buffer.data[i+(width*2)]+=(qerror);
			}
		}
		a.putImageData(buffer,0,0);
	}

	studio.red = function(a) {
		var buffer=a.getImageData(0,0,a.width,a.height);
		var width=(a.width*4);
		for (var i=0; i<buffer.data.length; i+=4) {
			buffer.data[i+1]=buffer.data[i+2]=0;
		}
		a.putImageData(buffer,0,0);
	}
	studio.blue = function(a) {
		var buffer=a.getImageData(0,0,a.width,a.height);
		var width=(a.width*4);
		for (var i=0; i<buffer.data.length; i+=4) {
			buffer.data[i]=buffer.data[i+1]=0;
		}
		a.putImageData(buffer,0,0);
	}

	studio.posterize = function(a) {
		var buffer=a.getImageData(0,0,a.width,a.height);
		var width=(a.width*4);
		for (var i=0; i<buffer.data.length; i+=4) {
			buffer.data[i]=((buffer.data[i]/64) >> 0)*64;
			buffer.data[i+1]=((buffer.data[i+1]/64) >> 0)*64;
			buffer.data[i+2]=((buffer.data[i+2]/64) >> 0)*64;
		}
		a.putImageData(buffer,0,0);
	}

	studio.displayFPS = function(a) {
		var n = 60 / a.frameRatio;
		n = n + (n < 0 ? -1 : 0) >> 0;
		var b = studio.buffer;
		var c = studio.bufferCTX;
		a.fillStyle = '#024';
		a.fillRect(2, 2, 40, 25);

		a.fillStyle = "#fff";
		a.fillText(n + ' fps', 4, 12);
		a.fillText(stage._children.length, 4, 24);
	}

	var halftoneFS=function(canvas){
		var effect = function(pixels) {
		  var d = pixels.data;
		  var width=(canvas.width*4);
		  for (var i=0; i<d.length; i+=4) {
		  	var oldpixel=(d[i]);
		  	var newpixel=parseInt(oldpixel/255)*255;
		  	d[i]=d[i+1]=d[i+2]=newpixel;
		  	var qerror = oldpixel-newpixel;
		  	if((i % width === 0) && (i+4 % width === 0)){
		  	
		  	}else{
		  		d[i+4]=d[i+5]=d[i+6]=d[i+4]+(qerror*(7/16));
		  		d[i+4+width]=d[i+5+width]=d[i+6+width]=d[i+4+width]+(qerror*(.1875));
		  		d[i+width]=d[i+1+width]=d[i+2+width]=d[i+width]+(qerror*(.3125));
		  		d[i+width-4]=d[i+width-3]=d[i+width-2]=d[i+width-4]+(qerror*(.0625));
		  	}
		  }
		  return pixels;
		};
		var buffer=canvas.getImageData(0,0,canvas.width,canvas.height);
		canvas.putImageData(effect(buffer),0,0);
	}


	var halftoneBA=function(canvas){
		var effect = function(pixels) {
		  var d = pixels.data;
		  var width=(canvas.width*4);
		  for (var i=0; i<d.length; i+=4) {
		  	var oldpixel=(d[i]);
		  	var newpixel=parseInt(oldpixel/255)*255;
		  	d[i]=d[i+1]=d[i+2]=newpixel;
		  	var qerror = (oldpixel-newpixel)*(.18);
		  if((i % width === 0) && (i+4 % width === 0)){
		  
		  }else{
		  		d[i+5]=d[i+6]=d[i+4]+=(qerror);
		  		d[i+9]=d[i+10]=d[i+8]+=(qerror);
		  		d[i+5+width]=d[i+6+width]=d[i+4+width]+=(qerror);
		  		d[i+1+width]=d[i+2+width]=d[i+width]+=(qerror);
		  		d[i+width-3]=d[i+width-2]=d[i+width-4]+=(qerror);
		  		d[i+width*2]=d[i+(width*2)]=d[i+(width*2)]+=(qerror);
		  	}
		  }
		  return pixels;
		};
		var buffer=canvas.getImageData(0,0,canvas.width,canvas.height);
		canvas.putImageData(effect(buffer),0,0);
	}


	stage.addEffect(studio.halftone);
	stage.addEffect(studio.displayFPS);
	var Asteroid = function(c) {
		this.z = Math.random() * 8;
		this.x = Math.random() * stage.width;
		this.y = Math.random() * stage.height;
		this.height = 24;
		this.width = this.height;
		this.bitmap = rock;
		this.sequence = rock_sheet;
		this.spriteSheetX=24;
		this.setStartingFrame(this.frame);
		this.fps = (Math.random()*6)+6;
		this.radius = this.width * .75;
		this.velocityX = Math.random() * 2;
		this.velocityY = Math.random() * 2;
		this.anchor = [.5, .5];
		this.onEnterFrame = function(s) {
			if (this.velocityX > 1) this.velocityX = 1;
			if (this.velocityX < -1) this.velocityX = -1;
			if (this.velocityY > 1) this.velocityY = 1;
			if (this.velocityY < -1) this.velocityY = -1;
			this.x += (s) * this.velocityX;
			this.y += (s) * this.velocityY;
			if (this.x > stage.width + 32) {
				this.x = -this.width;
				this.height = 24//Math.random() * 10 + 14;
				this.width = this.height;
				//this.radius = this.width / 2;
			}
			if (this.y >stage.height + 32) {
				this.y = -64;
				this.height = 24//Math.random() * 10 + 14;
				this.width = this.height;
				//this.radius = this.width / 2;
			}
			if (this.y < -64) this.y = stage.height + 32;
			if (this.x < -64) this.x = stage.width + 32;
		}
	}
	Asteroid.prototype = new studio.Sprite();

	for (var i=0;i!=40;i++){
		stage.addChild(new Asteroid());
	}
	butter = new studio.Sprite();
	butter.apply({x:50, y:50, width: 500, height:500})
	butter.bitmap = butterfly;

	butter.onReady = function(){
		this.addTween('easeInOut',{scaleX:4, scaleY:4},10000)
	}
	stage.addChild(butter);
	// stage.onReady=function(){
	// }
	// stage.onEnterFrame=function(b,a){
	// 	if(a<1.8){
	// 		stage.addChild(new Asteroid());
	// 	}
	// }


	stage.loop();





// Tween & Canvas Transport Example

 // stage2 = new studio.Stage('tween');
	// var item = new studio.Shape();
	// item.apply({height:50,width:50,x:0,y:50, color:'red'})

	// stage2.addChild(item)
	// stage2.shoot=function(){
	// 	item.addTween('easeInOut',{x:300},2000,function(){
	// 		this.runaway();
	// 		stageA.addChild(this);
	// 		stageA.shoot();
	// 	});
	// }
	// stage2.onReady=function(){
	// 	this.shoot();
	// }
	// stage2.loop();

	// var stageA = new studio.Stage('a');
	// stageA.camera.rotate=-24;
	// stageA.onReady=function(){
	// 	//this.camera.panTo(150,150,5000);
	// }
	// stageA.onEnterFrame=function(){
	// 	this.camera.rotate+=.1;
	// }
	// stageA.shoot=function(){
	// 	this.camera.x=150;
	// 	this.camera.y=150;
	// 	item.addTween('easeInOut',{x:0,y:0},2000,function(){
	// 		this.runaway();
	// 		stage2.addChild(this);
	// 		stage2.shoot();
	// 	});
	// }
	// stageA.loop();


	// var stageB = new studio.Stage('b');
	// stageB.loop();

	// stageB.addChild(new studio.Shape('container'));
	// stageB.addChild(new studio.Shape('someBlock'));
	// stageB.get('container').apply({height:240,width:240,x:10,y:10,color:"rgba(255,255,255,.2)"});
	// stageB.get('someBlock').apply({height:24,width:36,x:24,y:36,color:"#ff00ff"});
	// var container = stageB.get('container');
	// var someBlock = stageB.get('someBlock');
	
	// someBlock.velocityY=1;
	// someBlock.velocityX=1;
	// someBlock.onExitFrame= function(a){
	// 	this.x+=a*this.velocityX;
	// 	this.y+=a*this.velocityY;
	// 	if (this.hitTestObject(container)){
	// 		this.color='#f0f'
	// 		this.velocityY=1;
	// 		this.velocityX=1;
	// 	}else{
	// 		this.color='#fff';
	// 		this.x=50;
	// 		this.y=50;
	// 		this.velocityY=-1;
	// 		this.velocityX=-1;
	// 	}
	// }


});