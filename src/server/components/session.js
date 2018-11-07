const config = require('../config');
const common = require('./common');

class SessionValidator {
	constructor(params) {
		this.type = config.OBJECT_TYPE.SESSION;
		this.params = params;
	}

	validate(session) {
		let result = {
			name: session.$.NAME,
			errors: []
		};

		result.errors.push(this.checkName(session.$.NAME, session.$.MAPPINGNAME));
		result.errors.push(common.checkDescription(session.$.DESCRIPTION, this.params));

		// Check extensions (connections)
		if (session.SESSIONEXTENSION) {
			result.errors.push(
				...session.SESSIONEXTENSION.map(e => SessionValidator.checkExtension(e))
			);
		}

		// Check override of defaut config
		if (session.CONFIGREFERENCE && session.CONFIGREFERENCE[0].ATTRIBUTE) {
			result.errors.push({
				severity: config.SEVERITY.WARNING,
				text: 'Default config is overriden'
			});
		}

		// Check attributes
		if (session.ATTRIBUTE) {
			result.errors.push(...session.ATTRIBUTE.map(e => this.checkAttribute(e)));
		}

		result.errors = result.errors.filter(e => Object.keys(e).length !== 0);

		result = {
			...result,
			...common.getCount(result.errors)
		};

		return result;
	}

	checkName(sessionName, mappingName) {
		// Common check (with naming convention)
		const commonResult = common.checkName(sessionName, this.type, this.params);

		// Verify that name matches with mapping
		let sessionResult = {};
		if (sessionName.substring(1) !== mappingName.substring(1)) {
			sessionResult = {
				severity: config.SEVERITY.ERROR,
				text: `Invalid Name (Mapping ${mappingName})`
			};
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
			result = {
				severity: config.SEVERITY.ERROR,
				text: `Use variables for connections (${ex.SINSTANCENAME})`
			};
		}

		return result;
	}

	checkAttribute(attr) {
		let result = {};

		switch (attr.$.NAME) {
			case 'Write Backward Compatible Session Log File':
				if (this.params.WARNING_ENABLED === true && attr.$.VALUE !== 'YES') {
					result = {
						severity: config.SEVERITY.WARNING,
						text: 'Backward logs disabled'
					};
				}
				break;
			case '$Source connection value':
				if (attr.$.VALUE.length > 0 && !attr.$.VALUE.startsWith('$DBConnection')) {
					result = {
						severity: config.SEVERITY.ERROR,
						text: 'Invalid $Source connection information (use variable)'
					};
				}
				break;
			case '$Target connection value':
				if (attr.$.VALUE.length > 0 && !attr.$.VALUE.startsWith('$DBConnection')) {
					result = {
						severity: config.SEVERITY.ERROR,
						text: 'Invalid $Target connection information (use variable)'
					};
				}
				break;
			default:
				break;
		}

		return result;
	}
}

module.exports = SessionValidator;
