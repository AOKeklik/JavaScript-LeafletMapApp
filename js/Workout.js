class Workout {
	date = new Date().getTime()
	id = Math.random().toString(16).slice(2)

	constructor(distance, duration, coords) {
		this.distance = distance
		this.duration = duration
		this.coords = coords
	}

	_setDescription() {
		const currentDate = new Date(this.date)
		// prettier-ignore
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		this.description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${
			months[currentDate.getMonth()]
		} ${currentDate.getDate()}`
	}
}

export default Workout
