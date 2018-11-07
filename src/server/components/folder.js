const config = require('../config');
const WorkItemValidator = require('./workItem');
const SessionValidator = require('./session');
const MappItemValidator = require('./mappItem');

const common = require('./common');

class FolderValidator {
	constructor(params) {
		this.type = config.OBJECT_TYPE.FOLDER;
		this.params = params;

		this.workflowValidator = new WorkItemValidator(config.OBJECT_TYPE.WORKFLOW, this.params);
		this.workletValidator = new WorkItemValidator(config.OBJECT_TYPE.WORKLET, this.params);
		this.sessionValidator = new SessionValidator(this.params);
		this.mappingValidator = new MappItemValidator(config.OBJECT_TYPE.MAPPING, this.params);
		this.mappletValidator = new MappItemValidator(config.OBJECT_TYPE.MAPPLET, this.params);
	}

	validate(folder) {
		const result = {
			name: folder.$.NAME,
			countErrors: 0,
			countWarn: 0,
			workflows: [],
			worklets: [],
			configs: [],
			sessions: [],
			mappings: [],
			mapplets: []
		};

		if (folder.WORKFLOW) {
			result.workflows = folder.WORKFLOW.map(e => this.workflowValidator.validate(e));

			result.countErrors += result.workflows.reduce((agg, elt) => agg + elt.countErrors, 0);
			result.countWarn += result.workflows.reduce((agg, elt) => agg + elt.countWarn, 0);
		}

		if (folder.WORKLET) {
			result.worklets = folder.WORKLET.map(e => this.workletValidator.validate(e));

			result.countErrors += result.worklets.reduce((agg, elt) => agg + elt.countErrors, 0);
			result.countWarn += result.worklets.reduce((agg, elt) => agg + elt.countWarn, 0);
		}

		if (folder.CONFIG) {
			result.configs = folder.CONFIG.map(e => FolderValidator.checkConfig(e));

			result.countErrors += result.configs.reduce((agg, elt) => agg + elt.countErrors, 0);
			result.countWarn += result.configs.reduce((agg, elt) => agg + elt.countWarn, 0);
		}

		if (folder.SESSION) {
			result.sessions = folder.SESSION.map(e => this.sessionValidator.validate(e));

			result.countErrors += result.sessions.reduce((agg, elt) => agg + elt.countErrors, 0);
			result.countWarn += result.sessions.reduce((agg, elt) => agg + elt.countWarn, 0);
		}

		if (folder.MAPPING) {
			result.mappings = folder.MAPPING.map(e => this.mappingValidator.validate(e));

			result.countErrors += result.mappings.reduce((agg, elt) => agg + elt.countErrors, 0);
			result.countWarn += result.mappings.reduce((agg, elt) => agg + elt.countWarn, 0);
		}

		if (folder.MAPPLET) {
			result.mapplets = folder.MAPPLET.map(e => this.mappletValidator.validate(e));

			result.countErrors += result.mapplets.reduce((agg, elt) => agg + elt.countErrors, 0);
			result.countWarn += result.mapplets.reduce((agg, elt) => agg + elt.countWarn, 0);
		}

		return result;
	}

	static checkConfig(cfgItem) {
		let result = {
			name: cfgItem.$.NAME,
			errors: []
		};

		if (cfgItem.ATTRIBUTE) {
			result.errors = cfgItem.ATTRIBUTE.map(e => FolderValidator.checkConfigAttribute(e));
		}

		result.errors = result.errors.filter(e => Object.keys(e).length !== 0);

		result = {
			...result,
			...common.getCount(result.errors)
		};

		return result;
	}

	static checkConfigAttribute(attr) {
		let result = {};

		if (attr.$.NAME === 'Stop on errors' && attr.$.VALUE !== '1') {
			result = {
				severity: config.SEVERITY.ERROR,
				text: 'Stop on Errors should be set to 1'
			};
		}

		return result;
	}
}

module.exports = FolderValidator;
