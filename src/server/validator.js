const fs = require('fs');
const xml2js = require('xml2js');

const FolderValidator = require('./components/folder');

class Validator {
	constructor(params) {
		this.params = params;
		this.folderValidator = new FolderValidator(this.params);
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

		return {
			extract_date: content.POWERMART.$.CREATION_DATE,
			folders: content.POWERMART.REPOSITORY[0].FOLDER.map(e =>
				this.folderValidator.validate(e)
			)
		};
	}
}

module.exports = Validator;
