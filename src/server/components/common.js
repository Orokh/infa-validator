const config = require('../config');

function checkName(name, type, params) {
	if (!name || !type || !params) {
		throw new Error(`All parameters are required ${name}, ${type}, ${params}`);
	}

	let result = {};
	const targetNaming = params.NAMING[type.toUpperCase()];
	const splitName = targetNaming.split('|');

	if (!splitName.some(e => name.startsWith(`${e}_`))) {
		result = {
			severity: config.SEVERITY.ERROR,
			text: 'Invalid Name'
		};
	}

	return result;
}

function checkDescription(description, params) {
	const result = {};

	if (description.length === 0) {
		switch (params.DESCRIPTION_LEVEL) {
			case '2':
				result.severity = config.SEVERITY.ERROR;
				break;
			case '1':
				if (params.WARNING_ENABLED === true) result.severity = config.SEVERITY.WARNING;
				break;
			default:
				break;
		}

		if (result.severity) {
			result.text = 'Missing Description';
		}
	}

	return result;
}

module.exports.checkName = checkName;
module.exports.checkDescription = checkDescription;