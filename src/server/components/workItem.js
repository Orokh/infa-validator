const config = require('../config');
const common = require('./common');
const SessionValidator = require('./session');

class WorkItemValidator {
	constructor(type, params) {
		this.type = type.name;
		this.params = params;

		this.sessionValidator = new SessionValidator(config.OBJECTS.SESSION, this.params);
	}

	validate(workItem) {
		let result = {
			name: workItem.$.NAME,
			errors: [],
			sessions: []
		};

		// Naming convention
		result.errors.push(common.checkObjectName(workItem.$.NAME, this.type, this.params));

		// Attributes
		if (workItem.ATTRIBUTE) {
			result.errors.push(
				...workItem.ATTRIBUTE.map(e => WorkItemValidator.checkAttribute(e, workItem.$.NAME))
			);
		}

		// Instances
		if (workItem.TASKINSTANCE) {
			result.errors.push(
				...workItem.TASKINSTANCE.map(e => WorkItemValidator.checkTaskInstance(e))
			);
		}

		result = common.cleanResult(result, this.params);

		// Sessions
		if (workItem.SESSION) {
			result.sessions = workItem.SESSION.map(e => this.sessionValidator.validate(e));

			result.countErrors += result.sessions.reduce((agg, elt) => agg + elt.countErrors, 0);
			result.countWarn += result.sessions.reduce((agg, elt) => agg + elt.countWarn, 0);
		}

		return result;
	}

	static checkAttribute(attr, wfName) {
		let result = {};

		const name = attr.$.NAME;
		const value = attr.$.VALUE;

		switch (name) {
			case 'Write Backward Compatible Workflow Log File':
				if (value !== 'YES') {
					result = {
						severity: config.SEVERITY.WARNING,
						text: 'Backward logs disabled'
					};
				}
				break;
			case 'Workflow Log File Name':
				if (wfName !== value.split('.')[0]) {
					result = {
						severity: config.SEVERITY.WARNING,
						text: 'Badly named log file'
					};
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

		if (
			task.$.NAME.toUpperCase() !== 'START' &&
			(task.$.TASKTYPE.toUpperCase() === 'SESSION' ||
				task.$.TASKTYPE.toUpperCase() === 'WORKLET')
		) {
			if (task.$.FAIL_PARENT_IF_INSTANCE_FAILS !== 'YES') {
				result = {
					severity: config.SEVERITY.ERROR,
					text: `Failure management invalid: ${task.$.NAME}`
				};
			}
		}

		return result;
	}
}

module.exports = WorkItemValidator;
