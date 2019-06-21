const AWS = require('aws-sdk');
const fs = require('fs');
const xml2js = require('xml2js');

const config = require('../config');
const FolderValidator = require('./helpers/folder');

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
	AWS.config.update(config.aws_local_config);
} else {
	AWS.config.update(config.aws_remote_config);
}

const docClient = new AWS.DynamoDB.DocumentClient();

class Validator {
	constructor(params) {
		this.params = params;
		this.folderValidator = new FolderValidator(this.params);
		this.reviewDate = new Date();
	}

	static getFile(fileID) {
		const parser = new xml2js.Parser();
		let repoStructure = {};

		try {
			// Read XML extract to be validated
			const srcFileContent = fs.readFileSync(`${__dirname}/storage/${fileID}`, 'utf-8');
			parser.parseString(srcFileContent, (err, result) => {
				repoStructure = result;
			});
		} catch (e) {
			console.log('Error:', e.stack);
		}

		return repoStructure;
	}

	validate(fileID) {
		const content = Validator.getFile(fileID);
		let extractDate = content.POWERMART.$.CREATION_DATE;

		// MM/DD/YYYY HH24:MI:SS
		const datePattern = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
		extractDate = new Date(extractDate.replace(datePattern, '$3-$1-$2T$4:$5:$6'));

		const result = {
			extractDate,
			folders: content.POWERMART.REPOSITORY[0].FOLDER.map(e =>
				this.folderValidator.validate(e)
			)
		};

		result.folders.forEach(elt => this.storeFolder(elt, result.extractDate));

		return result;
	}

	storeFolder(folder, extractDate) {
		const params = {
			TableName: config.aws_table_names.FOLDER,
			Item: {
				name: folder.name
			}
		};

		docClient.put(params, err => {
			if (err) {
				console.log(err);
			}
		});

		folder.workflows.forEach(elt =>
			this.storeResult(folder.name, elt, 'workflow', extractDate)
		);
		folder.worklets.forEach(elt => this.storeResult(folder.name, elt, 'worklet', extractDate));
		folder.configs.forEach(elt => this.storeResult(folder.name, elt, 'config', extractDate));
		folder.sessions.forEach(elt => this.storeResult(folder.name, elt, 'session', extractDate));
		folder.mappings.forEach(elt => this.storeResult(folder.name, elt, 'mapping', extractDate));
		folder.mapplets.forEach(elt => this.storeResult(folder.name, elt, 'mapplet', extractDate));
	}

	storeObject(folderName, object, type) {
		const params = {
			TableName: config.aws_table_names.OBJECT,
			Item: {
				folderName,
				name: object.name,
				type,
				lastChecked: this.reviewDate.toISOString()
			}
		};

		docClient.put(params, err => {
			if (err) {
				console.log(err);
			}
		});
	}

	storeResult(folderName, object, type, extractDate) {
		this.storeObject(folderName, object, type);

		const params = {
			TableName: config.aws_table_names.RESULT,
			Item: {
				folderName: `${folderName}`,
				objectExtractDate: `${object.name}#${extractDate.toISOString()}`,
				lastReviewDate: this.reviewDate.toISOString(),
				countErrors: object.countErrors,
				countWarn: object.countWarn,
				extractDate: extractDate.toISOString()
			}
		};

		docClient.put(params, err => {
			if (err) {
				console.log(err);
			}
		});
	}
}

module.exports = Validator;
