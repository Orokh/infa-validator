const config = require('../config');
const WorkItemValidator = require('./workItem');
const SessionValidator = require('./session');
const MappItemValidator = require('./mappItem');

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
		const res = {
			name: folder.$.NAME,
			workflows: [],
			worklets: [],
			configs: [],
			sessions: [],
			mappings: [],
			mapplets: []
		};

		if (folder.WORKFLOW) {
			res.workflows = folder.WORKFLOW.map(e => this.workflowValidator.validate(e));
		}
		if (folder.WORKLET) {
			res.worklets = folder.WORKLET.map(e => this.workletValidator.validate(e));
		}

		if (folder.CONFIG) {
			res.configs = folder.CONFIG.map(e => FolderValidator.checkConfig(e));
		}

		if (folder.SESSION) {
			res.sessions = folder.SESSION.map(e => this.sessionValidator.validate(e));
		}

		if (folder.MAPPING) {
			res.mappings = folder.MAPPING.map(e => this.mappingValidator.validate(e));
		}

		if (folder.MAPPLET) {
			res.mapplets = folder.MAPPLET.map(e => this.mappletValidator.validate(e));
		}

		return res;
	}

	static checkConfig(cfgItem) {
		const result = {
			name: cfgItem.$.NAME,
			errors: []
		};

		if (cfgItem.ATTRIBUTE) {
			result.errors = cfgItem.ATTRIBUTE.map(e => FolderValidator.checkConfigAttribute(e));
		}

		result.errors = result.errors.filter(e => Object.keys(e).length !== 0);

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
