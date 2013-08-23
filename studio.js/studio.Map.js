var map={ "height":20,
 "layers":[
        {
         "data":[1, 1, 1, 1, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 12, 28, 28, 1, 1, 1, 1, 10, 28, 28, 28, 10, 28, 10, 10, 10, 10, 28, 28, 28, 13, 28, 28, 1, 1, 1, 1, 10, 10, 10, 10, 10, 28, 10, 28, 28, 10, 10, 28, 28, 13, 28, 28, 28, 28, 28, 107, 10, 28, 107, 28, 10, 28, 10, 28, 9, 28, 10, 28, 28, 12, 28, 28, 28, 28, 28, 6, 10, 10, 10, 10, 10, 28, 10, 28, 28, 28, 10, 28, 28, 28, 28, 9, 28, 10, 28, 28, 10, 107, 28, 28, 10, 28, 10, 10, 10, 10, 10, 28, 28, 28, 28, 28, 90, 28, 28, 18, 18, 18, 18, 106, 18, 18, 18, 18, 18, 18, 208, 28, 97, 107, 37, 28, 193, 193, 193, 178, 179, 179, 180, 198, 70, 54, 18, 18, 18, 18, 240, 194, 194, 195, 194, 224, 193, 193, 193, 209, 193, 195, 197, 193, 69, 218, 18, 18, 18, 18, 214, 193, 193, 193, 193, 193, 209, 193, 193, 194, 193, 193, 193, 193, 70, 226, 181, 19, 18, 18, 213, 195, 196, 194, 195, 193, 193, 197, 193, 193, 193, 193, 193, 193, 69, 165, 166, 166, 166, 167, 212, 193, 193, 193, 193, 193, 28, 28, 28, 18, 18, 18, 18, 18, 85, 18, 18, 18, 18, 18, 18, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 12, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 47, 40, 40, 40, 44, 44, 44, 47, 40, 47, 40, 40, 43, 40, 40, 46, 47, 40, 48, 46, 44, 47, 44, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 44, 44, 44, 44, 44, 44, 47, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 47, 40, 46, 46, 46, 46, 46, 46, 46, 46, 202, 243, 243, 243, 243, 244, 201, 161, 178, 179, 180, 137, 46, 46, 46, 46, 46, 46, 46, 202, 241, 246, 245, 241, 241, 199, 200, 62, 63, 62, 62, 62, 46, 46, 46, 46, 46, 46, 202, 246, 245, 245, 246, 245, 245, 227, 204, 63, 63, 63, 63, 63],
         "height":20,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }],
 "orientation":"orthogonal",
 "properties":
    {

    },
 "tileheight":32,
 "tilesets":[
        {
         "firstgid":1,
         "image":"aztec_sheet.png",
         "imageheight":512,
         "imagewidth":512,
         "margin":0,
         "name":"aztec_sheet",
         "properties":
            {

            },
         "spacing":0,
         "tileheight":32,
         "tilewidth":32
        }],
 "tilewidth":32,
 "version":1,
 "width":20
}









Studio.Map=function(obj){
	this.width = obj.width;
	this.height = obj.height;
	this.tilewidth = obj.tilewidth;
	this.tileheight = obj.tileheight;
	this.tileset = new Studio.Image(obj.tilesets[0].image,this.tilewidth,this.tileheight);
	this.tilesetWidth=16;
	var data = obj.layers[0].data;
	this.data= this.computeData(data);
	this.image=new Image();
	
	this.buffer= document.createElement('canvas');
	document.body.appendChild(this.buffer);
	this._bufferCTX= this.buffer.getContext('2d');
}

Studio.Map.prototype.computeData = function(data){
	var result=[];
	for (var i = 0; i!=data.length;i++){
		var dat=data[i]-1;
		result.push(dat/this.tilesetWidth);
	}
	return result;
}


Studio.Map.prototype.drawMap = function (){
	var data= this.data;
	var length= data.length;
	var buffer=this.buffer;
	var ctx=this._bufferCTX;
	buffer.width=this.width*this.tilewidth;
	buffer.height=this.height*this.tileheight;
	var width=this.width;
	var x=0;
	var y=0;
	for (var i=0;i!=length;i++){
		var frame= data[i];
		var tileY=frame+(frame<0?-1:0) | 0;
		var tileX=(frame-tileY)*this.tilesetWidth ||0;
		y=i/width |0;
		x=i-(y*width);
		ctx.drawImage(this.tileset.image,
		this.tilewidth*tileX,
		this.tileheight*tileY,
		this.tilewidth,
		this.tileheight,
		x*this.tilewidth,y*this.tileheight,this.tilewidth,this.tileheight);
	}
	this.image.src=buffer.toDataURL();
}


Studio.Map.prototype.constructor = Studio.Map;
