"use strict";

const Homey = require('homey');
const Device = require('../../lib/Device');
const taHoma = require('../../lib/tahoma');

//Device for a io:LightIOSystemSensor device
class LightSensorDevice extends Device {

	onInit() {
		this.log('device init');
        this.log('name:', this.getName());
        this.log('class:', this.getClass());

        this.registerCapabilityListener('measure_luminance', this.onCapabilityMeasureLuminance.bind(this));
	}

	onAdded() {
		this.log('device added');
	}

	onDeleted() {
		this.log('device deleted');
	}

	onCapabilityMeasureLuminance(value, opts) {
		var deviceData = this.getData();

		var oldLuminance = this.getState().measure_luminance;
		if (oldLuminance != value) {
			this.setCapabilityValue('measure_luminance', value);

			let device = this;
			let tokens = {
				'luminance': value
			};

			let state  = {
				'measure_luminance': value
			}

			//trigger flows
			let driver = this.getDriver();
			driver
				.triggerLuminanceMoreThan(device, tokens, state)
				.triggerLuminanceLessThan(device, tokens, state)
				.triggerLuminanceBetween(device, tokens, state);
		}

		return Promise.resolve();
	}
}

module.exports = LightSensorDevice;