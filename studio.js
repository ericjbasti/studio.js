"use strict";

/*
	Studio.js
	© 2010-13 Eric J. Basti
	version 0.8
*/


(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
		var currTime = Date.now;
		var timeToCall = currTime - lastTime;
		var id = window.setTimeout(function() {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};

	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}());

define(function() {
	var Studio = {
		assets: {length : 0},
		queue: 0,
		loaded: true,
		loadOnDemand: false,
		buffer: document.createElement('canvas'),
		bufferCTX: null,
		snapToPixel: false,
		version: '0.8'
	};
	Studio.bufferCTX=Studio.buffer.getContext("2d");
	return Studio;
});
