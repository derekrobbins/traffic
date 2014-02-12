!function (Traffic, $) {
	'use strict';

	var carTmpl  = "<div class='car'></div>";

	Traffic.View.Car = function (parentEl) {
		this.el 			= $(carTmpl);
		this.parentX 	= Math.floor((parentEl.width() - this.el.width()) / 2);
		this.parentY 	= Math.floor((parentEl.height() - this.el.height()) / 2);

		parentEl.append(this.el);
	};

	Traffic.View.Car.prototype.show = function(oArgs) {
		this.update(oArgs);
		this.el.addClass('display');
	};

	Traffic.View.Car.prototype.update = function(oArgs) {
		var x 			= this.parentX + (oArgs.x * 1),
			y 			= this.parentY + (oArgs.y * 1),
			css 		= '',
			cssTemplate = 'transform: rotate(' + oArgs.angle + 'deg) translate(' + x + 'px,' + y + 'px);';

		css += '-webkit-' + cssTemplate;
		css += '-moz-' + cssTemplate;
		css += '-ms-' + cssTemplate;
		css += '-o-' + cssTemplate;
		css += cssTemplate;

		console.log(this.el);

		this.el.attr('style', css);
	};
}(Traffic, jQuery);