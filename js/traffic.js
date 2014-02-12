
/*
	Change this:
	The main function should act the same as a car but with no boundary on distance.
	The cars should work by firing an event every time a control is changed (throttle, brake, steering, etc)
	Cars only listen to other cars within some radius and each keep and internal model of what all the other
	cars are doing until they leave that radius.

	Another possibility is to use each car's onboard sensor (normally used to detect road obsticles) as a way to
	verify/correct the positions of other cars. In high traffic areas several sets of cars can be used to detect
	a single car, giving a highly precise location for each vehicle as well as any obsticles in the road.
*/

window.Traffic = {
	View: {}
};

!function (Traffic) {
	'use strict';

	var carList = [];

	function update () {
		var i = 0;

		for (; i < carList.length; i++) {
			carList[i].update();
			console.log(carList[i].getPosition());
		}
	}

	Traffic.init = function () {
		window.setInterval(update, 10);
	};

	Traffic.newCar = function (oArgs) {
		carList.push(new Traffic.Car(oArgs));
	}

}(Traffic);