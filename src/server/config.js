module.exports = Object.freeze({
	OBJECT_TYPE: {
		FOLDER: 'FOLDER',
		WORKFLOW: 'WORKFLOW',
		WORKLET: 'WORKLET',
		SESSION: 'SESSION',
		MAPPING: 'MAPPING',
		AGGREGATOR: 'Aggregator',
		CUSTOM: 'Custom Transformation',
		EXPRESSION: 'Expression',
		FILTER: 'Filter',
		JOINER: 'Joiner',
		LOOKUP: 'Lookup Procedure',
		LOOKUPOW: 'LOOKUPOW',
		NORMALIZER: 'Normalizer',
		OUTPUT: 'Output Transformation',
		ROUTER: 'Router',
		SEQUENCE: 'Sequence',
		SORTER: 'Sorter',
		SQ: 'Source Qualifier',
		SQOW: 'SQOW',
		UNION: 'Union Transformation',
		UPDATE: 'Update Strategy',
		INPUT: 'Input Transformation',
		MAPPLET: 'Mapplet'
	},
	SEVERITY: {
		ERROR: 2,
		WARNING: 1,
		NONE: 0,
		INFO: -1
	},
	EXCLUDE_TRANS_NAME: [
		'Custom Transformation',
		'Filter',
		'Joiner',
		'Input Transformation',
		'Lookup Procedure',
		'Normalizer',
		'Output Transformation',
		'Router',
		'Sequence',
		'Union Transformation'
	],
	EXCLUDE_TRANS_CONNEC: [
		'CUSTOM',
		'FILTER',
		'Input Transformation',
		'LOOKUP',
		'MAPPLET',
		'Output Transformation',
		'Router',
		'Sequence',
		'Union Transformation'
	],
	TRANS_MUST_NOT_LINK: ['Aggregator', 'Expression', 'Filter', 'Router', 'SORTER', 'UPDATE'],
	aws_table_names: {
		FOLDER: 'Folder',
		OBJECT: 'Object',
		RESULT: 'Result'
	},
	aws_local_config: {
		region: 'local',
		endpoint: 'http://localhost:3333'
	},
	aws_remote_config: {
		region: 'eu-west-3'
	}
});
