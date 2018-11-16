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
	TableName: config.aws_table_names.RESULT
};

module.exports = app => {
	// Get all folders
	app.get('/api/result', (req, res) => {
		const { folderName, objectName } = req.query;

		if (folderName && objectName) {
			// Get a single item, based on folder and name
			const expression = `#id = :id`;

			const params = {
				...defaultParams,
				KeyConditionExpression: expression,
				ExpressionAttributeNames: {
					'#id': 'id'
				},
				ExpressionAttributeValues: {
					':id': `${folderName}#${objectName}`
				}
			};

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

	app.post('/api/result', (req, res) => {
		const { folderName, objectName, reviewDate, cntError, cntWarn } = req.body;

		const params = {
			...defaultParams,
			Item: {
				id: `${folderName}#${objectName}`,
				reviewDate,
				cntError,
				cntWarn
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
