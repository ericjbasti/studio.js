require.config({
	baseUrl: "../../studio.js",
	paths: {
		display: 'display'
	}
});

require(['display/Sprite','input/Touch','display/Loader', 'display/Animation', 'display/Vector'], function(studio) {

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
	

	var mask = new studio.Vector();
	mask.apply({width:122.1, height:122, anchorY:.5,anchorY:.5})
	mask.vector = function(ctx){
		//ctx.save();
      	ctx.beginPath();
      	ctx.moveTo(64.6, 0.0);
      	ctx.lineTo(79.8, 46.9);
      	ctx.lineTo(129.1, 46.9);
      	ctx.lineTo(89.2, 75.4);
      	ctx.lineTo(104.5, 122.1);
      	ctx.lineTo(64.6, 93.0);
     	ctx.lineTo(24.7, 121.9);
      	ctx.lineTo(39.9, 75.5);
      	ctx.lineTo(0.0, 46.9);
      	ctx.lineTo(49.3, 46.9);
      	ctx.lineTo(64.6, 0.0);
      	ctx.closePath();
      	ctx.clip();
      	//ctx.fill();
      	//ctx.restore();
	}


	//stage.addChild(mask);
	planet.addChildren(moon, spaceStation);
	stage.addChild(planet);
	planet.makeInteractive();

	stage.onReady = function(){
		planet.addTween('easeInOut',{y:240,x:240},2000);
		//mask.addTween('easeInOut',{scaleX:3,scaleY:3},2000)
	}


	stage.loop();
});