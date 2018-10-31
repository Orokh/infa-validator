module.exports = Object.freeze({
	OBJECT_TYPE: {
		FOLDER: 'FOLDER',
		WORKFLOW: 'WORKFLOW',
		WORKLET: 'WORKLET',
		SESSION: 'SESSION',
		MAPPING: 'MAPPING',
		AGGREGATOR: 'AGGREGATOR',
		CUSTOM: 'CUSTOM TRANSFORMATION',
		EXPRESSION: 'EXPRESSION',
		FILTER: 'FILTER',
		JOINER: 'JOINER',
		LOOKUP: 'LOOKUP',
		LOOKUPOW: 'LOOKUPOW',
		NORMALIZER: 'NORMALIZER',
		OUTPUT: 'OUTPUT',
		ROUTER: 'ROUTER',
		SEQUENCE: 'SEQUENCE',
		SORTER: 'SORTER',
		SQ: 'SQ',
		SQOW: 'SQOW',
		UNION: 'UNION TRANSFORMATION',
		UPDATE: 'UPDATE',
		INPUT: 'INPUT',
		MAPPLET: 'MAPPLET'
	},
	SEVERITY: {
		ERROR: 2,
		WARNING: 1,
		NONE: 0,
		INFO: -1
	},
	EXCLUDE_TRANS_NAME: [
		'CUSTOM',
		'FILTER',
		'JOINER',
		'INPUT',
		'NORMALIZER',
		'OUTPUT',
		'Router',
		'SEQUENCE'
	],
	EXCLUDE_TRANS_CONNEC: [
		'CUSTOM',
		'FILTER',
		'INPUT',
		'LOOKUP',
		'MAPPLET',
		'OUTPUT',
		'ROUTER',
		'SEQUENCE'
	],
	TRANS_MUST_NOT_LINK: ['AGGREGATOR', 'EXPRESSION', 'FILTER', 'ROUTER', 'SORTER', 'UPDATE']
});