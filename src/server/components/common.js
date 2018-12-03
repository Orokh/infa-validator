const config = require('../config');

function checkName(name, category, type, params) {
	if (!name || !category || !type || !params) {
		throw new Error(`All parameters are required (${name}, ${type}, ${params})`);
	}

	let result = {};
	const targetNaming = params.NAMING[category][type.toUpperCase()].default;
	const splitName = targetNaming.split('|');

	if (!splitName.some(e => name.startsWith(`${e}_`))) {
		result = {
			severity: config.SEVERITY.ERROR,
			text: 'Invalid Name'
		};
	}

	return result;
}

function checkObjectName(name, type, params) {
	return checkName(name, 'OBJECTS', type, params);
}

function checkTransName(name, type, params) {
	return checkName(name, 'TRANSFORMATIONS', type, params);
}

function checkFieldName(name, type, params) {
	return checkName(name, 'FIELDS', type, params);
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

function getCount(errors) {
	const resCount = {
		countErrors: 0,
		countWarn: 0
	};

	resCount.countErrors = errors.reduce(
		(acc, curr) => (curr.severity === config.SEVERITY.ERROR ? acc + 1 : acc),
		0
	);

	resCount.countWarn = errors.reduce(
		(acc, curr) => (curr.severity === config.SEVERITY.WARNING ? acc + 1 : acc),
		0
	);

	return resCount;
}

function trimErrors(errors, params) {
	let result = errors.filter(elt => Object.keys(elt).length !== 0);

	if (!params.WARNING_ENABLED) {
		result = result.filter(elt => elt.severity === config.SEVERITY.ERROR);
	}

	return result;
}

function cleanResult(result, params) {
	let newRes = result;

	if (result.errors) {
		newRes.errors = trimErrors(result.errors, params);

		newRes = {
			...newRes,
			...getCount(newRes.errors)
		};
	}

	const itemsLists = Object.keys(result).filter(
		elt => elt !== 'name' && elt !== 'errors' && result[elt].length > 0
	);

	if (itemsLists.length > 0) {
		itemsLists.forEach(elt => {
			newRes.countErrors += result[elt].reduce((agg, curr) => agg + curr.countErrors, 0);
			newRes.countWarn += result[elt].reduce((agg, curr) => agg + curr.countWarn, 0);
		});
	}

	return newRes;
}

module.exports.checkDescription = checkDescription;
module.exports.checkObjectName = checkObjectName;
module.exports.checkTransName = checkTransName;
module.exports.checkFieldName = checkFieldName;
module.exports.cleanResult = cleanResult;
