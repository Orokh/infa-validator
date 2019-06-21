const config = require('../../config');
const common = require('./common');

const Result = require('./result');
const SessionValidator = require('./session');

module.exports = class WorkItemValidator {
	constructor(type, params) {
		this.type = type.name;
		this.params = params;

		this.sessionValidator = new SessionValidator(config.OBJECTS.SESSION, this.params);
	}

	validate(workItem) {
		const name = workItem.$.NAME;

		const result = {
			name,
			errors: [],
			sessions: []
		};

		// Naming convention
		result.errors.push(common.checkObjectName(name, this.type, this.params));

		// Attributes
		if (workItem.ATTRIBUTE) {
			result.errors.push(
				...workItem.ATTRIBUTE.map(elt => WorkItemValidator.checkAttribute(elt, name))
			);
		}

		// Instances
		if (workItem.TASKINSTANCE) {
			result.errors.push(
				...workItem.TASKINSTANCE.map(elt => WorkItemValidator.checkTaskInstance(elt))
			);
		}

		// Sessions
		if (workItem.SESSION) {
			result.sessions = workItem.SESSION.map(elt => this.sessionValidator.validate(elt));
		}

		return common.cleanResult(result, this.params);
	}

	static checkAttribute(attr, wfName) {
		let result = {};

		const name = attr.$.NAME;
		const value = attr.$.VALUE;

		switch (name) {
			case 'Write Backward Compatible Workflow Log File':
				if (value !== 'YES') {
					result = new Result('Backward logs disabled', config.SEVERITY.WARNING);
				}
				break;
			case 'Workflow Log File Name':
				if (wfName !== value.split('.')[0]) {
					result = new Result('Badly named log file', config.SEVERITY.WARNING);
				}
				break;
			case 'Save Workflow log by':
				break;
			default:
				break;
		}

		return result;
	}

	static checkTaskInstance(task) {
		let result = {};
		const name = task.$.NAME;
		const type = task.$.TASKTYPE.toUpperCase();

		if (name !== 'START' && (type === 'SESSION' || type === 'WORKLET')) {
			if (task.$.FAIL_PARENT_IF_INSTANCE_FAILS !== 'YES') {
				result = new Result(`Failure management invalid: ${name}`, config.SEVERITY.ERROR);
			}
		}

		return result;
	}
};
