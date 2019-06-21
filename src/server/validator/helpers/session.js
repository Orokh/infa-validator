const config = require('../../config');
const common = require('./common');

const Result = require('./result');

module.exports = class SessionValidator {
	constructor(type, params) {
		this.type = type.name;
		this.params = params;
	}

	validate(session) {
		const name = session.$.NAME;
		const description = session.$.DESCRIPTION;
		const mappingName = session.$.MAPPINGNAME;

		const result = {
			name,
			errors: []
		};

		result.errors.push(this.checkName(name, mappingName));
		result.errors.push(common.checkDescription(description, this.params));

		// Check extensions (connections)
		if (session.SESSIONEXTENSION) {
			result.errors.push(
				...session.SESSIONEXTENSION.map(e => SessionValidator.checkExtension(e))
			);
		}

		// Check override of defaut config
		if (session.CONFIGREFERENCE && session.CONFIGREFERENCE[0].ATTRIBUTE) {
			result.errors.push(new Result('Default config is overriden', config.SEVERITY.WARNING));
		}

		// Check attributes
		if (session.ATTRIBUTE) {
			result.errors.push(...session.ATTRIBUTE.map(e => SessionValidator.checkAttribute(e)));
		}

		return common.cleanResult(result, this.params);
	}

	checkName(sessionName, mappingName) {
		// Common check (with naming convention)
		const commonResult = common.checkObjectName(sessionName, this.type, this.params);

		// Verify that name matches with mapping
		let sessionResult = {};
		if (sessionName.substring(1) !== mappingName.substring(1)) {
			sessionResult = new Result(
				`Invalid Name (Mapping ${mappingName})`,
				config.SEVERITY.ERROR
			);
		}

		const result = {
			...commonResult,
			...sessionResult
		};

		return result;
	}

	static checkExtension(ex) {
		let result = {};
		const connec = ex.CONNECTIONREFERENCE;

		if (connec && connec.CNXREFNAME === 'DB Connection' && !connec.VARIABLE.startsWith('$')) {
			result = new Result(
				`Use variables for connections (${ex.SINSTANCENAME})`,
				config.SEVERITY.ERROR
			);
		}

		return result;
	}

	static checkAttribute(attr) {
		let result = {};
		const name = attr.$.NAME;
		const value = attr.$.VALUE;

		switch (name) {
			case 'Write Backward Compatible Session Log File':
				if (value !== 'YES') {
					result = new Result('Backward logs disabled', config.SEVERITY.WARNING);
				}
				break;
			case '$Source connection value':
				if (value.length > 0 && !value.startsWith('$DBConnection')) {
					result = new Result(
						'Invalid $Source connection information (use variable)',
						config.SEVERITY.ERROR
					);
				}
				break;
			case '$Target connection value':
				if (value.length > 0 && !value.startsWith('$DBConnection')) {
					result = new Result(
						'Invalid $Target connection information (use variable)',
						config.SEVERITY.ERROR
					);
				}
				break;
			default:
				break;
		}

		return result;
	}
};
