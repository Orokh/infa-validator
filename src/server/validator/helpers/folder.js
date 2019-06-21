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

		this.container = {
			WORKFLOW: {
				name: 'workflows',
				validator: new WorkItemValidator(config.OBJECTS.WORKFLOW, this.params)
			},
			WORKLET: {
				name: 'worklets',
				validator: new WorkItemValidator(config.OBJECTS.WORKLET, this.params)
			},
			SESSION: {
				name: 'sessions',
				validator: new SessionValidator(config.OBJECTS.SESSION, this.params)
			},
			MAPPING: {
				name: 'mappings',
				validator: new MappItemValidator(config.OBJECTS.MAPPING, this.params)
			},
			MAPPLET: {
				name: 'mapplets',
				validator: new MappItemValidator(config.OBJECTS.MAPPLET, this.params)
			}
		};
	}

	validate(folder) {
		const name = folder.$.NAME;

		const result = {
			name,
			countErrors: 0,
			countWarn: 0,
			configs: [],
			workflows: [],
			worklets: [],
			sessions: [],
			mappings: [],
			mapplets: []
		};

		Object.keys(this.container).forEach(key => {
			if (folder[key]) {
				result[this.container[key].name] = folder[key].map(elt =>
					this.container[key].validator.validate(elt)
				);
			}
		});

		if (folder.CONFIG) {
			result.configs = folder.CONFIG.map(e => this.checkConfig(e));
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
