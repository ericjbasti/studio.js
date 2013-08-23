define(['display/Shape','display/Font'],function(Studio){
Studio.TextBox=function(width,height){
	this.font;
	this.fontSize=24;
	this._fontScale=1;
	this.kerning=1.02;
	this.lineHeight=1.5;
	this.bitmap= document.createElement('canvas');
	this.bitmap.height=this.height=height||512;
	this.bitmap.width=this.width=width||512;
	this._bufferCTX= this.bitmap.getContext('2d');
	this.ready=true;
	this.text="";
	this.frameRect = {
		x1: 0,
		y1: 0,
		x2: this.bitmap.width,
		y2: this.bitmap.height
	};
	
}

Studio.TextBox.prototype = new Studio.Shape();
Studio.TextBox.prototype.constructor = Studio.TextBox;
Studio.TextBox.prototype.type = 'Studio.TextBox';


Studio.TextBox.prototype.setFont= function(font){
	this.font=font;
	this.updateBitmap();
}

Studio.TextBox.prototype.setText= function(text){
	this.text=text;
	this.updateBitmap();
}

Studio.TextBox.prototype.resizeBitmap= function(lines){
	this._fontScale=this.fontSize/this.font.height;

	var maxWidth = 0;

	for (var i=0;i!=lines.length;i++){
		if(lines[i].length>maxWidth) maxWidth= lines[i].length;
	}
	//this.height=lines.length*(this.fontSize*this.lineHeight);
	//this.width=maxWidth*(this.font.width*this._fontScale);
}

Studio.TextBox.prototype.updateBitmap=function(){
	var font=this.font;
	var sheetX=0;
	var sheetY=0;
	var c=0;
	var map=font._cMap;
	var ctx=this._bufferCTX;

	if (font.bitmap.ready) {
		this.resizeBitmap(this.text);
		ctx.clearRect(0,0,this.bitmap.width,this.bitmap.height);
		var lineSpacing=(this.lineHeight*this.fontSize)*this.ctx.resolution;
		var kerning= (this.kerning*font.width)*this._fontScale*this.ctx.resolution;
		var lines = this.text.split('\n');
		for (var l=0; l!=lines.length;l++){
			var text=lines[l];
			for (var i=0;i!=text.length;i++){
				c=map[text[i]];
				sheetY=c+(c<0?-1:0) | 0;
				sheetX=((c-sheetY)*font.sheetWidth);
				ctx.drawImage(font.bitmap.image,sheetX*font.width,sheetY*font.height,font.width,font.height,i*kerning,l*lineSpacing,font.width*this._fontScale*this.ctx.resolution,this.fontSize*this.ctx.resolution);
			}
		}
	}
}

Studio.TextBox.prototype.drawBasic = Studio.TextBox.prototype.draw = function() {
	var s= this.ctx;
	s.globalAlpha = this._alpha;
	var width=this._width;
	var height=this._height;
	var x=this._x;
	var y=this._y;
	if(Studio.snapToPixel){
		x=this._x+(this._x<0?-1:0) | 0;
		y=this._y+(this._y<0?-1:0) | 0;
		height=height+(height<0?-1:0) | 0;
		height=height+(height<0?-1:0) | 0;
	}
	
	if (this.bitmap && this.ready) {
		s.drawImage(this.bitmap,x,y,width,height);
	} 
	
};

return Studio;
});
