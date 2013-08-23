require.config({
	baseUrl: "../../studio.js",
	paths: {
		display: 'display'
	}
});

require(['display/Sprite','input/Touch','display/Loader', 'Animation'], function(studio) {

	// lets redefine some defaults:
	studio.Shape.prototype.anchorX=.5;
	studio.Shape.prototype.anchorY=.5;

	var stage = new studio.Stage('stage');
	stage.color=null; // no background color, lets go transparent.
	stage.enableTouchEvents();

	var planet = new studio.Shape('block1');
	planet.apply({x:0,y:0,height:50,width:50,color:'yellow'});

	planet.onEnterFrame=function(a){
		this.rotate+=a;
	}

	var moon = new studio.Shape('moon1');
	moon.apply({x:30, y:30, height: 8, width: 8, color: 'red', orbitSpeed: 2});
	moon.receiveRotation = false; // rotate independently of our parents rotation. does not effect orbit however
	moon.onEnterFrame=function(a){
		this.rotate-=a;
	}

	var spaceStation = new studio.Shape('spaceStation');
	spaceStation.apply({x:80, y:70, height: 6, width: 12, color: '#aaa', orbit: false, receiveRotation: false, rotate:-45});
	planet.touched = function(down,x,y,dx,dy){
		if(down){
			planet.x-=dx;
			planet.y-=dy;
		}
	}

	planet.addChildren(moon, spaceStation);
	stage.addChild(planet);
	planet.makeInteractive();
	
	stage.onReady = function(){
		planet.addTween('easeInOut',{y:240,x:240},2000);
	}


	stage.loop();
});