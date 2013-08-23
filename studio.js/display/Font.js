define(['studio','Display/Image'],function(Studio){
Studio.Font = function(path,width,height){
	this.width=width || 16;
	this.height=height || 16;
	this.sheetWidth=13;
	this.bitmap=new Studio.Image(path,width,height);
	// this.bitmap.onLoadComplete = function(){
	// 	var length=this._usedby.length;
	// 	if (length){
	// 		for (var i=0;i!=length;i++){
	// 			this._usedby[i].updateBitmap();
	// 		}
	// 	}
	// }
	this._c='';
	this._cMap={};

	this._usedby=[];
}

Studio.Font.prototype.characterMap = function (chars){
	this._c=chars;
	var length=chars.length;
	for (var i=0;i!=length;i++){
		this._cMap[chars[i]]=i/this.sheetWidth;
	}
}

Studio.Font.prototype.constructor = Studio.Font;

return Studio;
});