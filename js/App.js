"use strict"

import Cycling from "./Cycling.js"
import Running from "./Running.js"

const workoutsElement = document.querySelector(".workouts")
const formElement = document.querySelector(".form")
const typeInput = document.querySelector("[class$=type]")
const distanceInput = document.querySelector("[class$=distance]")
const durationInput = document.querySelector("[class$=duration]")
const cadenceInput = document.querySelector("[class$=cadence]")
const elevationInput = document.querySelector("[class$=elevation]")

class App {
	#map
	#mapZoomLevel = 13
	#mapCoords = []
	#workouts = []

	constructor() {
		this._getPosition()
		this._getLocalStorage()
		workoutsElement.addEventListener("click", this._moveToPopup.bind(this))
		formElement.addEventListener("submit", this._newWorkout.bind(this))
		typeInput.addEventListener("change", this._toggleElevationField)
	}

	_getPosition() {
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(
				this._loadMap.bind(this),
				function (err) {
					console.log(err)
				}
			)
	}

	_loadMap(position) {
		const { latitude, longitude } = position.coords
		const coords = [latitude, longitude]

		this.#map = L.map("map").setView(coords, this.#mapZoomLevel)
		L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map)

		this.#map.on("click", this._showForm.bind(this))

		this.#workouts.forEach(n => this._renderWorkoutMarker(n))
	}

	_moveToPopup(e) {
		if (!this.#map) return

		const el = e.target.closest(".workout")?.dataset
		if (!el) return

		const workout = this.#workouts.find(n => n.id === el.id)

		this.#map.setView(workout.coords, this.#mapZoomLevel, {
			animate: true,
			pan: { duration: 1 },
		})
	}

	_newWorkout(e) {
		try {
			e.preventDefault()

			const distance = +distanceInput.value
			const duration = +durationInput.value
			const isRunning = typeInput.value === "running"
			const formType = isRunning
				? +cadenceInput.value
				: +elevationInput.value

			const isNumber = (...values) =>
				values.every(n => Number.isFinite(n))
			const isPositiveNum = (...values) => values.every(n => n > 0)

			if (!isNumber(distance, duration, formType))
				throw new Error("Must be a valid number!")
			if (
				isRunning
					? !isPositiveNum(distance, duration, formType)
					: !isPositiveNum(distance, duration)
			)
				throw new Error("Must be greater than zero!")

			let workout = isRunning
				? new Running(distance, duration, this.#mapCoords, formType)
				: new Cycling(distance, duration, this.#mapCoords, formType)

			console.log(workout)

			this.#workouts.push(workout)
			this._renderWorkoutMarker(workout)
			this._renderWorkout(workout)
			this._hideForm()
			this._setLocalStorage()
		} catch (err) {
			console.log(err)
		}
	}

	_renderWorkout(workout) {
		const isRunning = workout.type === "running"
		formElement.insertAdjacentHTML(
			"afterend",
			// prettier-ignore
			`<li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                    <span class="workout__icon">${isRunning ? "🏃‍♂️" : "🚴‍♀️"}</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${isRunning ? workout.pace : workout.speed}</span>
                    <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">${isRunning ? "🦶🏼" : "⛰"}</span>
                    <span class="workout__value">${isRunning ? workout.cadence : workout.elevationGain}</span>
                    <span class="workout__unit">spm</span>
                </div>
            </li>`
		)
	}

	_renderWorkoutMarker(workout) {
		const isRunning = workout.type === "running"
		L.marker(workout.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: "300",
					minWidth: "100",
					autoClose: false,
					closeOnClick: false,
					className: `${workout.type}-popup`,
				})
			)
			.setPopupContent(
				`${isRunning ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
			)
			.openPopup()
	}

	_showForm(e) {
		const { lat, lng } = e.latlng
		this.#mapCoords = [lat, lng]
		formElement.classList.remove("hidden")
		distanceInput.focus()
	}

	_hideForm(e) {
		distanceInput.value =
			cadenceInput.value =
			elevationInput.value =
			durationInput.value =
				""
		formElement.style.display = "none"
		formElement.classList.add("hidden")
		setTimeout(() => (formElement.style.display = "grid"), 1000)
	}

	_setLocalStorage() {
		localStorage.setItem("workouts", JSON.stringify(this.#workouts))
	}

	_getLocalStorage() {
		const isWorkoutExist = JSON.parse(localStorage.getItem("workouts"))
		this.#workouts = isWorkoutExist || []

		this.#workouts.map(n => this._renderWorkout(n))
	}

	_toggleElevationField(e) {
		cadenceInput.closest(".form__row").classList.toggle("form__row--hidden")
		elevationInput
			.closest(".form__row")
			.classList.toggle("form__row--hidden")
	}
}

const app = new App()
console.log(app)