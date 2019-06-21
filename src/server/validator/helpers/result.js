const config = require('../../config');

module.exports = class Result {
	/**
	 * @constructor
	 * @param  {string} text     Result message
	 * @param  {number} severity Result severity. Must be defined in config.SEVERITY
	 */
	constructor(text, severity) {
		if (typeof text === 'string') {
			this.text = text;
		} else {
			this.text = '';
		}

		if (
			typeof severity === 'number' &&
			Object.entries(config.SEVERITY).some(elt => elt[1] === severity)
		)
			this.severity = severity;
		else this.severity = config.SEVERITY.INFO;
	}
};
