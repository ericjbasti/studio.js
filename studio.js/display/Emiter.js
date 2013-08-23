define(['display/Shape',''],function(Studio){
	Studio.Emiter = function(stats) {
		this.alpha = 0.1;
		this.x = x;
		this.y = y;
		this.gravity = -0.15;
		this.anchorX = 0.5;
		this.anchorY = 0.5;
		this.maxX = this.x+150;
		this.minX = this.x-150;
		this.maxY = 300-(this.height/2);
		this.color = 'rgba(255,255,255,0.1)';
		this.particles = [];
		this.init(stats);
	}
	
	Studio.Emiter.prototype = new Studio.DisplayObject();
	Studio.Emiter.prototype.constructor = Studio.Emiter;
	Studio.Emiter.prototype.type = 'Studio.Emiter';

	Studio.Emiter.prototype.init = function(stats){
		this.rotate = Math.random()*360;
		this.orbit=false;
		this.height = (Math.random()*32)+32;
		this.width = this.height;
		this.velocityX = (Math.random() -0.5) * 0.8;
		this.velocityY =  (Math.random() -0.5) * 2;
	}

	Studio.Emiter.prototype.updatePhysics =function(a){
		this.velocityY+=a*this.gravity;
		if (this.velocityY<-2) this.velocityY=-2;
		this.y+=this.velocityY;
		this.x+=this.velocityX;
		this.height=this.width-=(this.velocityY/10);
		this.alpha-= 0.0004;
		//this.alpha-=this.gravity/3;
	};

	Studio.Emiter.prototype.onReady = function(){
		
	}

	Studio.Emiter.prototype.onEnterFrame = function(a){
		this.updatePhysics(a);
		if(this.y>=this.maxY) {
			this.y=this.maxY;
			this.velocityY=(-this.velocityY/2);
			this.velocityX=(this.velocityX/4);
		}
		if(this.x>=this.maxX) {
			this.x=this.maxX;
			this.velocityX=(-this.velocityX/2);
		}
		if(this.x<=this.minX) {
			this.x=this.minX;
			this.velocityX=(-this.velocityX/2);
		}
		if(this._y<=-this.height || this.alpha<0){
			this.remove();
		}
	};


return Studio;
});