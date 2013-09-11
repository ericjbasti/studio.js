// ZOOM Logic v0.1
var aTour;
var Studio;


var map={width:4477,height:3676,tileSize:256,url:'imgs/mh001_img/'}
//var map={width:4586,height:3596,tileSize:256,url:'imgs/maryland_img/'};

function depth(a,b){
	var c=1;
	for (a;a<b;a=a*2){
		c++;
	}
	return c;
}

function computeLevels(width, height, tileSize){
	maxLevel = depth(tileSize,width>height ? width:height);
	var columns;
	var rows;
	var levels=[];
	for( var level = maxLevel-1; level >= 0; level-- ){
		var temp={};
		columns = Math.ceil( width / tileSize );
		rows = Math.ceil( height / tileSize );
		temp.width=width;
		temp.height=height;
		temp.columns=columns;
		temp.rows=rows;
		temp.zoom=map.width/width;
		levels.unshift(temp);
		width  = Math.ceil(width/2);
		height = Math.ceil(height/2);
	}
	return(levels);
}



require.config({
    baseUrl: "../../studio.js",
    paths: {
		display: 'display'
    }
});

require(['display/Sprite','display/Animation','input/Keyboard','input/Touch'],function(studio){
	studio.snapToPixel=false;
	studio.loadOnDemand=true;

	var imageurl=map.url;
	var zoom=0;
	var stage=new studio.Stage('stage');
	stage.setResponsive(true);
	var viewer=new studio.Shape();
	var detector=new studio.Shape();
	detector.height=stage.height;
	detector.width=stage.width;
	detector.isResponsive=true;
	detector.rHeight='100%';
	detector.rWidth='100%';
	detector.alpha=0;
	stage.addChild(detector);
	stage.addChild(viewer);
	
	aTour=stage;
	Studio=studio;
	var minScale=stage.width/map.width;
	levels=computeLevels(map.width,map.height,map.tileSize);
	
	function buildGrids(levels,tileSize){
		for (var l=0;l!=levels.length;l++){
			var lev=new studio.Shape();
			lev.color='blue';
			lev.scaleX=lev.scaleY=levels[l].zoom;
			viewer.addChild(lev);
			for (var x=0;x!=levels[l].columns;x++){
				for (var y=0;y!=levels[l].rows;y++){
					var name=l+'-'+x+'-'+y;
					var me=new studio.Sprite();
					me.pathToImage=imageurl+name+'.jpg';
					me.x=x*(tileSize);
					me.y=y*(tileSize);
					me.height=me.width=tileSize;
					me.alpha=0;
					me.onBitmapLoad=function(){
						// because we had to set a height and width to allow our hittest to work
						// we will now need to set the Sprite to the correct size, otherwise well get
						// a stretched image at the end pieces.
						this.height=this.bitmap.height;
						this.width=this.bitmap.width;
						this.addTween('easeOut',{alpha:1},500);
					};
					lev.addChild(me);
				}
			}
		}
	}
	
	buildGrids(levels,256);
	stage.color='#000';

	stage.enableTouchEvents();
	stage.enableKeyboardInput();
	viewer.color='orange';
	
	stage.makeInteractive();
	
	stage.touched=function(down,x,y,dx,dy){
		if(down){
			var scale=viewer.scaleX;
			viewer.x-=dx;
			viewer.y-=dy;
			this.checkBounds();
			this.updateZoom();
		}else{
			
		}
	};
	stage.checkBounds = function(){
		if (viewer.y<=-((map.height*viewer.scaleY)-detector.height)) viewer.y=-((map.height*viewer.scaleY)-detector.height);
		if (viewer.x<=-((map.width*viewer.scaleX)-detector.width)) viewer.x=-((map.width*viewer.scaleX)-detector.width);
		if (viewer.x>0) viewer.x=0;
		if (viewer.y>0) viewer.y=0;
	};
	stage.gesture=function(active,x,y,s,r){
		if(!active){
			var original=viewer.scaleX;
			var width=map.width*original;
			var height=map.height*original;
			viewer.scaleX=viewer.scaleY*=(s);
			if(viewer.scaleX>1) viewer.scaleX=viewer.scaleY=1;
			if(viewer.scaleX<minScale) viewer.scaleX=viewer.scaleY=minScale;
			viewer.x-=((map.width*viewer.scaleX)-width)/2;
			viewer.y-=((map.height*viewer.scaleX)-height)/2;
			zoom=getZoomLevel((viewer.scaleX)*map.width);
			this.checkBounds();
			this.updateZoom();
		}
	
	};
	
	stage.updateZoom=function(){
		var level=viewer._children[zoom];
		if(level._children){
			var length = level._children.length;
			var i = length;
			while (i) {
				var t=level._children[length - i];
				if(t.hitTestRectTL(detector)){
					t.color='green';
					t.visible=true;
					if(!t.bitmap){
						var temp=new studio.Image(t.pathToImage);
						t.bitmap=temp;
					}else{
						t.alpha=1;
					}
				}else{
					t.visible=false;
				}
				i--;
			}
		}
	};
	
	stage.onEnterFrame=function(){
		if(this.keys[65]) this.gesture(false,0,0,1.1,0);
		if(this.keys[83]) this.gesture(false,0,0,.9,0);
		if(this.keys[38]) this.touched(true,0,0,0,-5);
		if(this.keys[40]) this.touched(true,0,0,0,5);
		if(this.keys[37]) this.touched(true,0,0,-5,0);
		if(this.keys[39]) this.touched(true,0,0,5,0);
	};

	
	var getZoomLevel=function(width){
		for (var j=0;j!=levels.length;j++){ // lets go ahead and hide every layer
			viewer._children[j].visible=false;
		}
		for (var k=0;k!=levels.length;k++){ // lets go through the layers, find the best one to show and then break
			if(width<=levels[k].width) {
				break;
			}
		}
		if(k!=0) viewer._children[k-1].visible=true; // we should show the layer below for seams and such.
		viewer._children[k].visible=true; // lets show the active layer.
		return(k);
	};

	viewer.scaleX=viewer.scaleY=minScale;
	stage.onReady=function(){
		this.resize();

	};

	stage.onResize = function(){
		zoom=getZoomLevel(detector.width);
		minScale=stage.width/map.width;
		if(viewer.scaleX<=minScale) viewer.scaleX=viewer.scaleY=minScale;
		this.updateZoom();
		//this.resize();
	}
	stage.loop();
	
});