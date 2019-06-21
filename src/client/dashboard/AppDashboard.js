import React, { Component } from 'react';

import '../app.css';

import Title from '../common/title';
import ItemSelector from './components/itemSelector';
import ResultChart from './components/resultChart';

export default class AppDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			foldersList: [],
			objectsList: [],
			selectedFolder: '',
			labels: [],
			warnValues: [],
			errValues: []
		};

		this.onFolderChange = this.onFolderChange.bind(this);
		this.onObjectChange = this.onObjectChange.bind(this);
	}

	componentDidMount() {
		fetch(`/api/folder`)
			.then(response => response.json())
			.then(data =>
				this.setState({
					foldersList: data.list
				})
			);
	}

	onFolderChange(e) {
		this.setState({
			selectedFolder: e.target.value
		});

		if (e.target.value === '') {
			this.setState({
				objectsList: [],
				labels: [],
				warnValues: [],
				errValues: []
			});
		} else {
			fetch(`/api/object?folderName=${e.target.value}`)
				.then(response => response.json())
				.then(data =>
					this.setState({
						objectsList: data.list
					})
				);

			fetch(`/api/result?folderName=${e.target.value}`)
				.then(response => response.json())
				.then(data => this.defineDataSet(data.list));
		}
	}

	onObjectChange(e) {
		const { selectedFolder } = this.state;

		let url = `/api/result?folderName=${selectedFolder}`;

		if (e.target.value !== '') {
			url = `${url}&objectName=${e.target.value}`;
		}

		fetch(url)
			.then(response => response.json())
			.then(data => this.defineDataSet(data.list));
	}

	defineDataSet(results) {
		this.setState({
			labels: results.map(elt => new Date(elt.extractDate).toDateString()),
			warnValues: results.map(elt => elt.countWarn),
			errValues: results.map(elt => elt.countErrors)
		});
	}

	render() {
		const { labels, errValues, warnValues, foldersList, objectsList } = this.state;

		return (
			<div id="wrapper">
				<Title />
				<div className="w3-main">
					<div className="w3-container">
						<div className="w3-row-padding w3-margin-top w3-white">
							<ItemSelector
								onChange={this.onFolderChange}
								list={foldersList}
								label="Folder"
								defaultValue="None"
							/>{' '}
							<ItemSelector
								onChange={this.onObjectChange}
								list={objectsList}
								label="Object"
							/>{' '}
						</div>{' '}
					</div>{' '}
					<ResultChart labels={labels} errValues={errValues} warnValues={warnValues} />{' '}
				</div>{' '}
			</div>
		);
	}
}
