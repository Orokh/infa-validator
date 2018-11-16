const AWS = require('aws-sdk');
const fs = require('fs');
const xml2js = require('xml2js');

const config = require('./config');
const FolderValidator = require('./components/folder');

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
			const srcFileContent = fs.readFileSync(`${__dirname}/api/storage/${fileID}`, 'utf-8');
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

		const result = {
			extract_date: content.POWERMART.$.CREATION_DATE,
			folders: content.POWERMART.REPOSITORY[0].FOLDER.map(e =>
				this.folderValidator.validate(e)
			)
		};

		result.folders.forEach(elt => this.storeFolder(elt));

		return result;
	}

	storeFolder(folder) {
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

		folder.workflows.forEach(elt => this.storeResult(folder.name, elt, 'workflow'));
		folder.worklets.forEach(elt => this.storeResult(folder.name, elt, 'worklet'));
		folder.configs.forEach(elt => this.storeResult(folder.name, elt, 'config'));
		folder.sessions.forEach(elt => this.storeResult(folder.name, elt, 'session'));
		folder.mappings.forEach(elt => this.storeResult(folder.name, elt, 'mapping'));
		folder.mapplets.forEach(elt => this.storeResult(folder.name, elt, 'mapplet'));
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

	storeResult(folderName, object, type) {
		this.storeObject(folderName, object, type);

		const params = {
			TableName: config.aws_table_names.RESULT,
			Item: {
				id: `${folderName}#${object.name}`,
				reviewDate: this.reviewDate.toISOString(),
				countErrors: object.countErrors,
				countWarn: object.countWarn
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
