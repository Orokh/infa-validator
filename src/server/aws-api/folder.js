const AWS = require('aws-sdk');
const config = require('../config.js');

const handlers = require('./handlers.js');

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
	AWS.config.update(config.aws_local_config);
} else {
	AWS.config.update(config.aws_remote_config);
}

const docClient = new AWS.DynamoDB.DocumentClient();

const defaultParams = {
	TableName: config.aws_table_names.FOLDER
};

module.exports = app => {
	// Get all folders
	app.get('/api/folder', (req, res) => {
		const { name } = req.query;

		if (name) {
			// Get a single folder
			const params = {
				...defaultParams,
				Key: {
					name
				}
			};

			docClient.get(params, (err, data) => handlers.handleListResult(err, data, res));
		} else {
			// Return all folders
			docClient.scan(defaultParams, (err, data) => handlers.handleListResult(err, data, res));
		}
	});
};
