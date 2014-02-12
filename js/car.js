// probably a good idea to use metric

if (typeof window.Traffic === 'undefined') {
	window.Traffic = {};
}

!function (Traffic) {
	'use strict';

	Traffic.Car = function (oArgs) {
		var pub = {};

		// car controls
		this.velocity 		= oArgs.velocity 		|| 0;  		// m/s
		this.brakes   		= oArgs.brakes 			|| 0;    	// 0 - 1
		this.throttle 		= oArgs.throttle 		|| 0; 		// 0 - 1
		this.steering 		= oArgs. steering 		|| 0; 		// -1 - 1

		// car properties
		this.weight   		= oArgs.weight 			|| 1300;    // kg
		this.brakeStrength 	= oArgs.brakeStrength 	|| 2000; 	// Newtons
		this.acceleration 	= oArgs.acceleration 	|| 6;   	// m/s^2
		this.grip 			= oArgs.grip 			|| 0.7; 	// friction coefficient
		this.maxTurn 		= oArgs.maxTurn 		|| 0.2; 	// Maximum turning angle in radians
		this.wheelBase 		= oArgs.wheelBase 		|| 2.75;	// meters
		this.drag 			= oArgs.drag 			|| 0.31;    // drag coefficient

		// vairable info
		this.heading 		= 1; 		// radians
		this.position 		= {			// meters from 0,0
								x: 0,
								y: 0
							};			
		this.turningRadius  = 0; 		// current turning radius in meters, 0 if wheels are straight (infinite radius)

		this.view = new Traffic.View.Car(oArgs.viewParent)

		pub = {
			getAcceleration: 	this.getAcceleration.bind(this),
			getCar: 			this.getCar.bind(this),
			getPosition: 		this.getPosition.bind(this),
			getVelocity: 		this.getVelocity.bind(this),
			setBrake: 			this.setBrake.bind(this),
			setHeading: 		this.setHeading.bind(this),
			setThottle: 		this.setThrottle.bind(this),
			setSteering: 		this.setSteering.bind(this),
			update: 			this.update.bind(this),
			show: 	 			this.show.bind(this),
		};

		return pub;
	};

	Traffic.Car.prototype.getCar = function () {
		// return car object to be used by other cars
		return {
			getAcceleration: 	this.getAcceleration.bind(this),
			getHeading: 		this.getHeading.bind(this),
			getPosition: 		this.getPosition.bind(this),
			getVelocity: 		this.getVelocity.bind(this),
		}
	};

	Traffic.Car.prototype.getAcceleration = function() {
		return this.acceleration
	};

	Traffic.Car.prototype.getPosition = function() {
		return this.position;
	};

	Traffic.Car.prototype.getVelocity = function() {
		return this.velocity;
	};

	Traffic.Car.prototype.setBrake = function (level) {
		this.brakes = level;

		if (level > 0) {
			this.throttle = 0;
		}
	};

	Traffic.Car.prototype.setHeading = function(heading) {
		this.heading = heading;
	};

	Traffic.Car.prototype.setSteering = function (level) {
		this.steering = level;
	};

	Traffic.Car.prototype.setThrottle = function (level) {
		this.throttle = level;

		if (level > 0) {
			this.brakes = 0;
		}
	};

	Traffic.Car.prototype.show = function() {
		console.log(this);
		this.view.show({angle: this.heading, x: this.position.x, y: this.position.y});
	};

	Traffic.Car.prototype.update = function(elapsedTime) {
		var deltaX, deltaY, deltaV, deltaH;

		// update heading
		deltaH = 0;

		if (this.throttle) {
			deltaV = this.throttle * this.acceleration * elapsedTime;
		} else {
			deltaV = this.brakes * this.brakeStrength * elapsedTime * -1;
		}

		this.velocity += deltaV;

		deltaX = Math.cos(this.heading) * this.velocity * elapsedTime;
		deltaY = Math.sin(this.heading) * this.velocity * elapsedTime;

		this.position.x += deltaX;
		this.position.y += deltaY;

		this.view.update({angle: this.heading, x: this.position.x, y: this.position.y});
	};

}(Traffic);


