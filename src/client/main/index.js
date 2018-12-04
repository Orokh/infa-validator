import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import formModel from './config/formModel.json';

ReactDOM.render(<App formModel={formModel} />, document.getElementById('root'));
