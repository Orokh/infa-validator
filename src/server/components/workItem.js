const config = require('../config');
const common = require('./common');
const SessionValidator = require('./session');

class WorkItemValidator {
	constructor(type, params) {
		this.type = type;
		this.params = params;

		this.sessionValidator = new SessionValidator(this.params);
	}

	validate(workItem) {
		let result = {
			name: workItem.$.NAME,
			errors: [],
			sessions: []
		};

		// Naming convention
		result.errors.push(common.checkName(workItem.$.NAME, this.type, this.params));

		// Attributes
		if (workItem.ATTRIBUTE) {
			result.errors.push(
				...workItem.ATTRIBUTE.map(e => this.checkAttribute(e, workItem.$.NAME))
			);
		}

		// Instances
		if (workItem.TASKINSTANCE) {
			result.errors.push(...workItem.TASKINSTANCE.map(e => this.checkTaskInstance(e)));
		}

		result.errors = result.errors.filter(e => Object.keys(e).length !== 0);

		result = {
			...result,
			...common.getCount(result.errors)
		};

		// Sessions
		if (workItem.SESSION) {
			result.sessions = workItem.SESSION.map(e => this.sessionValidator.validate(e));

			result.countErrors += result.sessions.reduce((agg, elt) => agg + elt.countErrors);
			result.countWarn += result.sessions.reduce((agg, elt) => agg + elt.countWarn);
		}

		return result;
	}

	checkAttribute(attr, wfName) {
		let result = {};

		switch (attr.$.NAME) {
			case 'Write Backward Compatible Workflow Log File':
				if (this.params.WARNING_ENABLED === true && attr.$.VALUE !== 'YES') {
					result = {
						severity: config.SEVERITY.WARNING,
						text: 'Backward logs disabled'
					};
				}
				break;
			case 'Workflow Log File Name':
				if (this.params.WARNING_ENABLED === true && wfName !== attr.$.VALUE.split('.')[0]) {
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

	checkTaskInstance(task) {
		let result = {};

		if (
			task.$.NAME.toUpperCase() !== 'START' &&
			(task.$.TASKTYPE.toUpperCase() === 'SESSION' ||
				task.$.TASKTYPE.toUpperCase() === 'WORKLET')
		) {
			if (
				this.params.WARNING_ENABLED === true &&
				task.$.FAIL_PARENT_IF_INSTANCE_FAILS !== 'YES'
			) {
				result = {
					severity: config.SEVERITY.WARNING,
					text: `Failure management invalid: ${task.$.NAME}`
				};
			}
		}

		return result;
	}
}

module.exports = WorkItemValidator;
