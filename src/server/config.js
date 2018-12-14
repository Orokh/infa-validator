module.exports = Object.freeze({
	OBJECTS: {
		FOLDER: {
			name: 'Folder'
		},
		WORKFLOW: {
			name: 'Workflow'
		},
		WORKLET: {
			name: 'Worklet'
		},
		SESSION: {
			name: 'Session'
		},
		MAPPING: {
			name: 'Mapping'
		},
		MAPPLET: {
			name: 'Mapplet'
		}
	},
	TRANSFORMATIONS: {
		AGGREGATOR: {
			name: 'Aggregator',
			checkFieldName: true,
			checkConnectors: true
		},
		CUSTOM: {
			name: 'Custom Transformation',
			checkFieldName: false,
			checkConnectors: false
		},
		EXPRESSION: {
			name: 'Expression',
			checkFieldName: true,
			checkConnectors: true
		},
		FILTER: {
			name: 'Filter',
			checkFieldName: false,
			checkConnectors: false
		},
		INPUT: {
			name: 'Input Transformation',
			checkFieldName: false,
			checkConnectors: false
		},
		JOINER: {
			name: 'Joiner',
			checkFieldName: true,
			checkConnectors: true
		},
		LOOKUP: {
			name: 'Lookup Procedure',
			checkFieldName: false,
			checkConnectors: false
		},
		MAPPLET: {
			name: 'Mapplet',
			checkFieldName: false,
			checkConnectors: false
		},
		NORMALIZER: {
			name: 'Normalizer',
			checkFieldName: false,
			checkConnectors: false
		},
		OUTPUT: {
			name: 'Output Transformation',
			checkFieldName: false,
			checkConnectors: false
		},
		ROUTER: {
			name: 'Router',
			checkFieldName: false,
			checkConnectors: false
		},
		SEQUENCE: {
			name: 'Sequence',
			checkFieldName: false,
			checkConnectors: false
		},
		SORTER: {
			name: 'Sorter',
			checkFieldName: true,
			checkConnectors: true
		},
		SOURCE: {
			name: 'Source Qualifier',
			checkFieldName: true,
			checkConnectors: true
		},
		TRANS_CTL: {
			name: 'Transaction Control',
			checkFieldName: true,
			checkConnectors: true
		},
		UNION: {
			name: 'Union Transformation',
			checkFieldName: false,
			checkConnectors: false
		},
		UPDATE: {
			name: 'Update Strategy',
			checkFieldName: true,
			checkConnectors: true
		}
	},
	FIELDS: {
		IO: 'INPUT/OUTPUT',
		INPUT: 'INPUT',
		OUTPUT: 'OUTPUT',
		VARIABLE: 'LOCAL VARIABLE'
	},
	SEVERITY: {
		ERROR: 2,
		WARNING: 1,
		NONE: 0,
		INFO: -1
	},
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
