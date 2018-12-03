const fs = require('fs');
const Validator = require('../validator');

module.exports = app => {
	app.post('/api/file/upload', (req, res) => {
		console.log('POST received');
		const uploadFile = req.body.file;
		const timestamp = +new Date();
		const fileName = `${req.body.filename}-${timestamp}`;

		fs.writeFile(`${__dirname}/storage/${fileName}`, uploadFile, err => {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			console.log(`File ${fileName} saved`);

			res.json({
				fileID: `${fileName}`
			});

			return res.status(200);
		});
	});

	app.delete('/api/file/delete/:id', req => {
		console.log('DELETE received');

		if (typeof req.params.id !== 'undefined') {
			fs.unlink(`${__dirname}/storage/${req.params.id}`, (res, err) => {
				if (err) {
					console.log(err);
				}
				console.log(`File ${req.params.id} removed`);
			});
		}
	});

	app.post('/api/file/validate', (req, res) => {
		console.log('VALIDATE received');
		const { fileID } = req.body;
		const params = {
			WARNING_ENABLED: req.body.showWarning,
			DESCRIPTION_LEVEL: req.body.descriptionLevel,
			NAMING: {
				OBJECTS: {
					WORKFLOW: {
						default: req.body.workflowNaming
					},
					WORKLET: {
						default: req.body.workletNaming
					},
					SESSION: {
						default: req.body.sessionNaming
					},
					MAPPING: {
						default: req.body.mappingNaming
					},
					MAPPLET: {
						default: req.body.mappletNaming
					}
				},
				TRANSFORMATIONS: {
					AGGREGATOR: {
						default: req.body.aggNaming
					},
					EXPRESSION: {
						default: req.body.expNaming
					},
					FILTER: {
						default: req.body.filNaming
					},
					'INPUT TRANSFORMATION': {
						default: req.body.mpltInNaming
					},
					JOINER: {
						default: req.body.jnrNaming
					},
					'LOOKUP PROCEDURE': {
						default: req.body.lkpNaming,
						override: req.body.lkpoNaming
					},
					MAPPLET: {
						default: req.body.mappletNaming
					},
					NORMALIZER: {
						default: req.body.nrmNaming
					},
					'OUTPUT TRANSFORMATION': {
						default: req.body.mpltOutNaming
					},
					ROUTER: {
						default: req.body.rtrNaming
					},
					SEQUENCE: {
						default: req.body.seqNaming
					},
					'SOURCE QUALIFIER': {
						default: req.body.sqNaming,
						override: req.body.sqoNaming
					},
					SORTER: {
						default: req.body.srtNaming
					},
					'UNION TRANSFORMATION': {
						default: req.body.unNaming
					},
					'UPDATE STRATEGY': {
						default: req.body.updNaming
					}
				},
				FIELDS: {
					INPUT: {
						default: req.body.inputNaming
					},
					OUTPUT: {
						default: req.body.outputNaming
					},
					'LOCAL VARIABLE': {
						default: req.body.variableNaming
					}
				}
			}
		};

		const validator = new Validator(params);

		res.json(validator.validate(fileID));
		console.log('VALIDATE finished');
	});
};
