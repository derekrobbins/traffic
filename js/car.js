// probably a good idea to use metric

if (typeof window.Traffic === 'undefined') {
	window.Traffic = {};
}

!function (Traffic) {
	'use strict';

	var RHO = 1.2; // mass density of air

	Traffic.Car = function (oArgs) {
		var pub = {};

		this.count = 0;

		// car controls
		this.velocity 		= oArgs.velocity 		|| 0;  		// m/s
		this.brakes   		= oArgs.brakes 			|| 0;    	// 0 - 1
		this.throttle 		= oArgs.throttle 		|| 0; 		// 0 - 1
		this.steering 		= oArgs.steering 		|| 0; 		// -1 - 1

		// car properties
		this.mass   		= oArgs.mass 			|| 1300;    // kg
		this.brakeStrength 	= oArgs.brakeStrength 	|| 2000; 	// Newtons
		this.acceleration 	= oArgs.acceleration 	|| 6;   	// m/s^2
		this.grip 			= oArgs.grip 			|| 0.7; 	// friction coefficient
		this.maxTurn 		= oArgs.maxTurn 		|| 0.2; 	// Maximum turning angle in radians
		this.wheelBase 		= oArgs.wheelBase 		|| 2.75;	// meters
		this.drag 			= oArgs.drag 			|| 0.31;    // drag coefficient
		this.area 			= oArgs.area 			|| 2; 		// m^2 area of the front projection of the car

		this.rate 			= oArgs.rate 			|| 8; 		// time between updates in milliseconds
		this.elapsedTime  	= this.rate / 1000;

		// vairable info
		this.heading 		= 0;		// radians
		this.position 		= {			// meters from 0,0
								x: 0,
								y: 0
							};			
		this.turningRadius  = 0; 		// current turning radius in meters, 0 if wheels are straight (infinite radius)

		this.view = new Traffic.View.Car(oArgs.viewParent);
		this.view.show();

		pub = {
			draw: 				this.draw.bind(this),
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
			stop:   			this.stop.bind(this),
		};

		this.timer = window.setInterval(this.update.bind(this), this.rate);

		return pub;
	};

	Traffic.Car.prototype.draw = function() {
		this.view.update({position: this.position, angle: this.heading});
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
		this.view.show({angle: this.heading, x: this.position.x, y: this.position.y});
	};

	Traffic.Car.prototype.update = function() {
		var deltaX, deltaY, deltaV, deltaH, drag, dragDecel, radius,
			averageSteer = (this.oldSteering + this.steering) / 2;

		// account for air resistance
		drag = 0.5 * RHO * this.velocity * this.velocity * this.drag * this.area;
		dragDecel = drag / this.mass;

		// update heading
		if (averageSteer) {
			// get turning radius
			radius = this.wheelBase / Math.sin(this.steering / 2);
			
		}
		deltaH = 0;

		if (this.throttle) {
			deltaV = this.throttle * this.acceleration * this.elapsedTime - dragDecel;
		} else {
			deltaV = this.brakes * this.brakeStrength * this.elapsedTime * -1 - dragDecel;
		}

		this.velocity += deltaV;

		deltaX = Math.sin(this.heading) * this.velocity * this.elapsedTime;
		deltaY = Math.cos(this.heading) * this.velocity * this.elapsedTime * -1;

		this.position.x += deltaX;
		this.position.y += deltaY;

		this.oldSteering = this.steering;
	};

	Traffic.Car.prototype.stop = function() {
		window.clearTimeout(this.timer);
	};

}(Traffic);


