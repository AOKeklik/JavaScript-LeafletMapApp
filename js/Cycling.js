import Workout from "./Workout.js"

class Cycling extends Workout {
	type = "cycling"

	constructor(distance, duration, coords, elevationGain) {
		super(distance, duration, coords)
		this.elevationGain = elevationGain
		this._setDescription()
		this._calcSpeed()
	}

	_calcSpeed() {
		this.speed = (this.distance / (this.duration / 60)).toFixed(1)
	}
}

export default Cycling
