const AWS = require('aws-sdk');
const config = require('../config.js');

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
	// Get all folders
	app.get('/api/object', (req, res) => {
		const { folderName, name } = req.query;

		if (folderName) {
			// Get a single item, based on folder and name
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

			docClient.query(params, (err, data) => {
				if (err) {
					console.log(err);
					res.send({
						success: false,
						message: `Error: ${err.message}`
					});
				} else {
					const { Items } = data;
					res.send({
						success: true,
						message: 'Loaded objects',
						objects: Items
					});
				}
			});
		} else {
			// No param defined, return all objects
			const params = {
				...defaultParams
			};

			docClient.scan(params, (err, data) => {
				if (err) {
					console.log(err);
					res.send({
						success: false,
						message: `Error: ${err.message}`
					});
				} else {
					const { Items } = data;
					res.send({
						success: true,
						message: 'Objects list',
						folders: Items
					});
				}
			});
		}
	});

	app.post('/api/object', (req, res) => {
		const { folderName, name, type } = req.body;

		const params = {
			...defaultParams,
			Item: {
				folderName,
				name,
				type
			}
		};

		docClient.put(params, (err, data) => {
			if (err) {
				console.log(err);
				res.send({
					success: false,
					message: `Error: ${err.message}`
				});
			} else {
				const { Items } = data;
				res.send({
					success: true,
					message: 'Created object',
					folder: JSON.stringify(Items)
				});
			}
		});
	});
};
