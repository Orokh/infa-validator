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
				// KeyConditionExpression: '#n = :n',
				// ExpressionAttributeNames: {
				// 	'#n': 'name'
				// },
				// ExpressionAttributeValues: {
				// 	':n': name
				// }
			};

			docClient.get(params, (err, data) => {
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
						message: 'Loaded folder',
						folders: Items
					});
				}
			});
		} else {
			// No param defined, return all folders
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
						message: 'Folders list',
						folders: Items
					});
				}
			});
		}
	});

	app.post('/api/folder', (req, res) => {
		const { name } = req.body;

		const params = {
			...defaultParams,
			Item: {
				name
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
					message: 'Created folder',
					folder: JSON.stringify(Items)
				});
			}
		});
	});
};
