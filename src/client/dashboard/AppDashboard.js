import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

import '../app.css';

import Title from '../common/title';
import ItemSelector from './components/itemSelector';

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
			labels: results.map(elt => elt.extractDate),
			warnValues: results.map(elt => elt.countWarn),
			errValues: results.map(elt => elt.countErrors)
		});
	}

	render() {
		const { labels, errValues, warnValues } = this.state;

		const chartData = {
			labels,
			datasets: [
				{
					label: 'Errors',
					backgroundColor: 'rgba(244,67,45,0.5)',
					data: errValues
				},
				{
					label: 'Warnings',
					backgroundColor: 'rgba(255,152,0,0.5)',
					data: warnValues
				}
			]
		};

		const chartOptions = {
			scales: {
				yAxes: [
					{
						ticks: {
							min: 0,
							callback: value => {
								if (Math.floor(value) === value) {
									return value;
								}
								return null;
							}
						}
					}
				]
			}
		};

		const { foldersList } = this.state;
		const { objectsList } = this.state;

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
					<div className="w3-container">
						<div className="w3-row-padding w3-margin-top w3-white">
							<Bar data={chartData} width={100} height={30} options={chartOptions} />{' '}
						</div>{' '}
					</div>{' '}
				</div>{' '}
			</div>
		);
	}
}
