const config = require('../../config');
const WorkItemValidator = require('./workItem');
const SessionValidator = require('./session');
const MappItemValidator = require('./mappItem');
const Result = require('./result');

const common = require('./common');

module.exports = class FolderValidator {
	constructor(params) {
		this.type = config.OBJECTS.FOLDER;
		this.params = params;

		this.workflowValidator = new WorkItemValidator(config.OBJECTS.WORKFLOW, this.params);
		this.workletValidator = new WorkItemValidator(config.OBJECTS.WORKLET, this.params);
		this.sessionValidator = new SessionValidator(config.OBJECTS.SESSION, this.params);
		this.mappingValidator = new MappItemValidator(config.OBJECTS.MAPPING, this.params);
		this.mappletValidator = new MappItemValidator(config.OBJECTS.MAPPLET, this.params);
	}

	validate(folder) {
		const name = folder.$.NAME;

		const result = {
			name,
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
		}

		if (folder.WORKLET) {
			result.worklets = folder.WORKLET.map(e => this.workletValidator.validate(e));
		}

		if (folder.CONFIG) {
			result.configs = folder.CONFIG.map(e => this.checkConfig(e));
		}

		if (folder.SESSION) {
			result.sessions = folder.SESSION.map(e => this.sessionValidator.validate(e));
		}

		if (folder.MAPPING) {
			result.mappings = folder.MAPPING.map(e => this.mappingValidator.validate(e));
		}

		if (folder.MAPPLET) {
			result.mapplets = folder.MAPPLET.map(e => this.mappletValidator.validate(e));
		}

		return common.cleanResult(result, this.params);
	}

	checkConfig(cfgItem) {
		const name = cfgItem.$.NAME;

		const result = {
			name,
			errors: []
		};

		if (cfgItem.ATTRIBUTE) {
			result.errors = cfgItem.ATTRIBUTE.map(e => FolderValidator.checkConfigAttribute(e));
		}

		return common.cleanResult(result, this.params);
	}

	static checkConfigAttribute(attr) {
		const name = attr.$.NAME;
		const value = attr.$.VALUE;
		let result = {};

		if (name === 'Stop on errors' && value !== '1') {
			result = new Result('Stop on Errors should be set to 1', config.SEVERITY.ERROR);
		}

		return result;
	}
};
