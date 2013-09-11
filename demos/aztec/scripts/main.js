require.config({
	baseUrl: "../../studio.js",
	paths: {
		display: 'display'
	}
});

require(['display/Sprite','display/SpriteSheet','input/Touch','display/Loader', 'display/Animation'], function(studio) {

	//spp= new studio.SpriteSheet('imgs/untitled.json');


	// lets redefine some defaults:
	studio.Shape.prototype.anchorX=.5;
	studio.Shape.prototype.anchorY=.5;

	stage = new studio.Stage('stage');
	stage.color=null; // no background color, lets go transparent.
	stage.enableTouchEvents();

	var spriteSheet = new studio.Image('imgs/sheet1.png',32,32);
	
	var character = new studio.Sprite();

	character.bitmap = spriteSheet;
	character.apply({x:50,y:50,height:32,width:32});

	var rock_sheet = [6,7,0,1,2,3,4,5];
	studio.buildSheet(rock_sheet,8);

	var rock_sheetBack = [14,15,8,9,10,11,12,13];
	studio.buildSheet(rock_sheetBack,8);

	var rock_sheetBackRest = [32,33,34,35];
	studio.buildSheet(rock_sheetBackRest,8);

	character.spriteSheetX=8;

	stage.addChild(character);

	var ground= new studio.Shape();
	ground.apply({x:150,y:76,height:20,width:300,color:'green'});

	stage.addChild(ground);
	var count=0;

	var loader = new studio.Loader();
	loader.apply({height:stage.height,width:stage.width,color:'rgba(0,125,0,.2)'});

	var progressBar = new studio.Shape();
	progressBar.apply({x:50,y:50,width:250,height:25,scaleX:0});

	progressBar.onEnterFrame=function(){
		this.scaleX=this.parent.progress;
	}

	loader.addChild(progressBar)
	stage.setLoader(loader);



	charLoop = function(){
		if(count<2){
			character.sequence = rock_sheet;
			character.addTween('linear',{x:250},3000, function(){
				this.sequence= rock_sheetBack;
				this.addTween('linear',{x:50},3000,function(){
					charLoop();
					count++;
				});
			});
		}else{
			character.fps= 6;
			character.sequence= rock_sheetBackRest;
		}
	}

	stage.onReady = function(){
		charLoop();
	}

	stage.loop();
});