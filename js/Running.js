import Workout from "./Workout.js"

class Running extends Workout {
	type = "running"

	constructor(distance, duration, coords, cadence) {
		super(distance, duration, coords)
		this.cadence = cadence
		this._setDescription()
		this._calcPace()
	}

	_calcPace() {
		this.pace = (this.duration / this.distance).toFixed(1)
	}
}

export default Running
