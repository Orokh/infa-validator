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
	TableName: config.aws_table_names.RESULT
};

function aggrResult(acc, elt) {
	const findIndex = acc.findIndex(searchElt => searchElt.reviewDate === elt.reviewDate);

	if (findIndex === -1) {
		acc.push({
			reviewDate: elt.reviewDate,
			countWarn: elt.countWarn,
			countErrors: elt.countErrors
		});
	} else {
		acc[findIndex].countWarn += elt.countWarn;
		acc[findIndex].countErrors += elt.countErrors;
	}

	return acc;
}

module.exports = app => {
	// Get all folders
	app.get('/api/result', (req, res) => {
		const { folderName, objectName } = req.query;

		if (folderName && objectName) {
			// Get results for a single item, based on folder and name
			const params = {
				...defaultParams,
				KeyConditionExpression: `folderName = :folderName and begins_with(objectReviewDate, :objectName)`,
				ExpressionAttributeValues: {
					':folderName': folderName,
					':objectName': `${objectName}#`
				}
			};

			docClient.query(params, (err, data) => handlers.handleListResult(err, data, res));
		} else if (folderName) {
			// Get results for all objects in a folder, aggregate to reviewDate
			const params = {
				...defaultParams,
				KeyConditionExpression: `folderName = :folderName`,
				ExpressionAttributeValues: {
					':folderName': `${folderName}`
				}
			};

			docClient.query(params, (err, data) =>
				handlers.handleListResult(err, data, res, aggrResult)
			);
		} else {
			// No param defined, return all results
			docClient.scan(defaultParams, (err, data) => handlers.handleListResult(err, data, res));
		}
	});
};
