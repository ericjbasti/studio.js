_s.Stage.prototype.resize = function(){
		var who=this._respondTo;
		this._setDimensions(who.clientWidth||who.innerWidth,who.clientHeight||who.innerHeight);
		this._updateResponders();
		if(this.onResize) this.onResize();
	}
	_s.Stage.prototype.setResponsive = function(status,who){
		this.responsive=status;
		if(this.responsive && !this.ctx._reponders) this.ctx._responders=[];
		
		who= this._respondTo = document.getElementById(who) || window;
		this._setDimensions(who.clientWidth||who.innerWidth,who.clientHeight||who.innerHeight);
		
		if(this.responsive){
			var me=this;
			window.onresize=function(){me.resize()};
		}else{
			window.onresize=function(){};
		}
	};
	_s.Stage.prototype._updateResponders = function(){
		var responders=this.ctx._responders;
		var length=responders.length;
		for (var i=0;i!=length;i++){
			var responder=responders[i];
			var percent=null;
			if(responder.rWidth){
				percent=parseFloat(responder.rWidth);
				responder.width=this.width*(percent/100);
			}
			if(responder.rHeight){
				percent=parseFloat(responder.rHeight);
				responder.height=this.height*(percent/100);
			}
			if(responder.vPosition){
				switch (responder.vPosition){
					case 'bottom' : responder.y=this.height-responder.height;break;
					case 'center' : responder.y=(this.height/2)-(responder.height/2);break;
					default : percent=parseFloat(responder.vPosition); responder.y=(this.height*(percent/100))-responder.height;break;
				}
			}
			if(responder.hPosition){
				switch (responder.hPosition){
					case 'right' : responder.x=(this.width-responder.width);break;
					case 'center' : responder.x=((this.width/2)-(responder.width/2));break;
					default : percent=parseFloat(responder.hPosition); responder.x=(this.width*(percent/100))-responder.width;break;
				}
			}
		}
	};

	_s.DisplayObject.prototype.isResponsive = false;

	