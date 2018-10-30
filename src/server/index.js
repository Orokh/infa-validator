const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const Validator = require('./validator');

const app = express();

app.use(express.static('dist'));

app.use(
	bodyParser.json({
		limit: '50mb',
		extended: true
	})
);

app.post('/api/upload', (req, res) => {
	console.log('POST received');
	const uploadFile = req.body.file;
	const timestamp = +new Date();
	const fileName = `${req.body.filename}-${timestamp}`;

	fs.writeFile(`${__dirname}/public/${fileName}`, uploadFile, err => {
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

app.delete('/api/delete/:id', req => {
	console.log('DELETE received');

	if (typeof req.params.id !== 'undefined') {
		fs.unlink(`${__dirname}/public/${req.params.id}`, (res, err) => {
			if (err) {
				console.log(err);
			}
			console.log(`File ${req.params.id} removed`);
		});
	}
});

app.post('/api/validate', (req, res) => {
	console.log('VALIDATE received');
	const { fileID } = req.body;
	const params = {
		WARNING_ENABLED: req.body.showWarning,
		DESCRIPTION_LEVEL: req.body.descriptionLevel,
		NAMING: {
			WORKFLOW: req.body.workflowNaming,
			WORKLET: req.body.workletNaming,
			SESSION: req.body.sessionNaming,
			MAPPING: req.body.mappingNaming,
			MAPPLET: req.body.mappletNaming,
			AGGREGATOR: req.body.aggNaming,
			EXPRESSION: req.body.expNaming,
			FILTER: req.body.filNaming,
			'INPUT TRANSFORMATION': req.body.mpltInNaming,
			JOINER: req.body.jnrNaming,
			'LOOKUP PROCEDURE': req.body.lkpNaming,
			LOOKUPOW: req.body.lkpoNaming,
			NORMALIZER: req.body.nrmNaming,
			'OUTPUT TRANSFORMATION': req.body.mpltOutNaming,
			ROUTER: req.body.rtrNaming,
			SEQUENCE: req.body.seqNaming,
			'SOURCE QUALIFIER': req.body.sqNaming,
			SQOW: req.body.sqoNaming,
			SORTER: req.body.srtNaming,
			'UNION TRANSFORMATION': req.body.unNaming,
			'UPDATE STRATEGY': req.body.updNaming,
			FIELD_INPUT: req.body.inputNaming,
			FIELD_OUTPUT: req.body.outputNaming,
			FIELD_LOCAL_VARIABLE: req.body.variableNaming
		}
	};

	const validator = new Validator(params);

	res.json(validator.validate(fileID));
	console.log('VALIDATE finished');
});

app.listen(8080, () => console.log('Listening on port 8080!'));
