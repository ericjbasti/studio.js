require.config({
	baseUrl: "../../studio.js",
	paths: {
		display: 'display'
	}
});

require(['display/Sprite', 'display/Vector', 'input/Touch','display/Loader'], function(studio) {
	// Asteroid Benchmark
	studio.snapToPixel=true;

	stage = new studio.Stage('stage');
	//stage.color='red'
	var rock= new studio.Image('imgs/24grey.gif',24,24);
	var rock_sheet = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
	studio.buildSheet(rock_sheet,24);
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

	stage.addEffect(studio.displayFPS);

	var Asteroid = function(c) {
		this.z = Math.random() * 8;
		this.x = Math.random() * stage.width;
		this.y = Math.random() * stage.height;
		this.height = Math.random() * 10 + 14;
		this.width = this.height;
		this.bitmap = rock;
		this.sequence = rock_sheet;
		this.spriteSheetX=24;
		this.setStartingFrame(this.frame);
		this.fps = (Math.random()*6)+6;
		this.velocityX = Math.random() * 2;
		this.velocityY = Math.random() * 2;
		this.onEnterFrame = function(s) {
			if (this.velocityX > 1) this.velocityX = 1;
			if (this.velocityX < -1) this.velocityX = -1;
			if (this.velocityY > 1) this.velocityY = 1;
			if (this.velocityY < -1) this.velocityY = -1;
			this.x += (s) * this.velocityX;
			this.y += (s) * this.velocityY;
			if (this.x > stage.width + 32) {
				this.x = -this.width;
				this.height = Math.random() * 10 + 14;
				this.width = this.height;
			}
			if (this.y >stage.height + 32) {
				this.y = -64;
				this.height = Math.random() * 10 + 14;
				this.width = this.height;
			}
			if (this.y < -64) this.y = stage.height + 32;
			if (this.x < -64) this.x = stage.width + 32;
		}
	}
	Asteroid.prototype = new studio.Sprite();

	for (var i=0;i!=3000;i++){
		stage.addChild(new Asteroid());
	}

	stage.onReady=function(){
	}
	stage.onEnterFrame=function(b,a){
		 //if(b<34){
		 	//stage.addChild(new Asteroid());
		//}else{
//
		//}
		if(this.ctx.delta<34) this.addChild(new Asteroid());
		//console.log(b,a);
	}


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

// window.onscroll = function(){
// 	var temp = stage.speed;
// 	stage.speed=0;
// 	setTimeout(function(){
// 		stage.speed=temp;
// 	},100);
// }