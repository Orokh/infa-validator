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
	TableName: config.aws_table_names.OBJECT
};

module.exports = app => {
	app.get('/api/object', (req, res) => {
		const { folderName, name } = req.query;

		if (folderName) {
			// Get a list of objects, based on folder and name
			const expression = `#f = :f ${name ? 'and #n = :n' : ''}`;

			const params = {
				...defaultParams,
				KeyConditionExpression: expression,
				ExpressionAttributeNames: {
					'#f': 'folderName'
				},
				ExpressionAttributeValues: {
					':f': folderName
				}
			};

			if (name) {
				params.ExpressionAttributeNames['#n'] = 'name';
				params.ExpressionAttributeValues[':n'] = name;
			}

			docClient.query(params, (err, data) => handlers.handleListResult(err, data, res));
		} else {
			// Return all objects
			docClient.scan(defaultParams, (err, data) => handlers.handleListResult(err, data, res));
		}
	});
};
