const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('dist'));

app.use(
	bodyParser.json({
		limit: '50mb',
		extended: true
	})
);

require('./api/file')(app);

app.listen(8080, () => console.log('Listening on port 8080!'));
