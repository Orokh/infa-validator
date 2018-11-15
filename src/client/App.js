import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './app.css';
import Title from './components/title';
import SideBar from './components/sidebar/sidebar';
import ResultDisplay from './components/result/resultDisplay';

export default class App extends Component {
	static propTypes = {
		formModel: PropTypes.arrayOf(PropTypes.object).isRequired
	};

	constructor(props) {
		super(props);
		this.state = {};
	}

	onSubmit(model) {
		const sentData = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(model)
		};

		fetch('/api/file/validate', sentData)
			.then(response => response.json())
			.then(jsonData => this.setState(jsonData))
			.catch(err => alert('There was a problem during validation: ', err.message));
	}

	render() {
		const { folders } = this.state;
		const { formModel } = this.props;

		return (
			<div id="wrapper">
				<Title />
				<SideBar
					formModel={formModel}
					onSubmit={model => {
						this.onSubmit(model);
					}}
				/>{' '}
				<div id="resultContent" className="w3-main">
					<div className="w3-container">
						<ResultDisplay result={folders} />{' '}
					</div>{' '}
				</div>{' '}
			</div>
		);
	}
}
