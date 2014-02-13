$(function () {
	'use strict';

	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	window.asdf = new Traffic.Car({viewParent: $('#container'), velocity: 10});

	var start = null;

	function step () {
		asdf.draw();
		requestAnimationFrame(step);
	}

	requestAnimationFrame(step);
});