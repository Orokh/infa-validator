import React from 'react';
import PropTypes from 'prop-types';
import FileInput from './fileInput';
import Section from './section';

import UIActions from '../uiActions';

export default class SideBar extends React.Component {
	static propTypes = {
		onSubmit: PropTypes.func.isRequired,
		formModel: PropTypes.arrayOf(PropTypes.object).isRequired
	};

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.validate = this.validate.bind(this);
		this.handleFileChosen = this.handleFileChosen.bind(this);

		this.state = {
			fileIsLoaded: false
		};

		const { formModel } = this.props;

		formModel.forEach(e => {
			e.components.forEach(c => {
				if (typeof c.defaultValue !== 'undefined') {
					this.state[c.key] = c.defaultValue;
				}
			});
		});
	}

	componentDidMount() {
		window.addEventListener('beforeunload', evt => this.componentCleanup(evt));
	}

	componentWillUnmount() {
		this.componentCleanup();
		window.removeEventListener('beforeunload'); // remove the event handler for normal unmounting
	}

	onChange(e, key) {
		this.setState({
			[key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
		});
	}

	static onFileUploadCompleted() {
		UIActions.enableValidate();
		UIActions.toggleFileLoader();
	}

	componentCleanup(evt) {
		evt.preventDefault();

		const { fileID } = this.state;

		if (typeof fileID !== 'undefined') {
			console.log(fileID, typeof fileID);
			const sentData = {
				method: 'DELETE',
				headers: {
					Accept: 'application/json'
				},
				body: JSON.stringify(fileID)
			};

			fetch(`/api/file/delete/${fileID}`, sentData)
				.then(response => response.json())
				.then(data => console.log(data));
		}
	}

	validate(e) {
		e.preventDefault();

		const { onSubmit } = this.props;

		if (onSubmit) {
			onSubmit(this.state);
		}
	}

	uploadChosenFile(content) {
		const { fileName } = this.state;

		const data = {
			filename: fileName,
			file: content
		};

		const sentData = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};

		fetch('/api/file/upload', sentData)
			.then(response => response.json())
			.then(d =>
				this.setState(
					{
						fileID: d.fileID,
						fileIsLoaded: true
					},
					SideBar.onFileUploadCompleted()
				)
			)
			.catch(err => alert('There was a problem during upload: ', err.message));
	}

	handleFileChosen(e, file) {
		const fileLoaded = file || e.target.files[0];
		const reader = new FileReader();

		if (fileLoaded) {
			UIActions.toggleFileLoader();

			const label = document.getElementById('inputFileName');
			label.innerHTML = fileLoaded.name;

			this.setState({
				fileIsLoaded: false,
				fileName: fileLoaded.name
			});

			reader.onloadend = () => {
				this.uploadChosenFile(reader.result);
			};

			// reader.onloadend = this.uploadChosenFile;

			reader.readAsText(fileLoaded);
		}
	}

	render() {
		const { formModel } = this.props;
		const { fileIsLoaded } = this.state;

		return (
			<nav
				id="sideNav"
				className="w3-sidebar w3-collapse w3-animate-left w3-white w3-border-right w3-border-grey w3-card-2"
			>
				<div className="w3-padding w3-padding w3-row-padding w3-theme-dark w3-large w3-hide-medium w3-hide-small">
					<i className="material-icons w3-padding-right"> bug_report </i>{' '}
					<span className="txt-normal"> Informatica Validator </span>{' '}
				</div>{' '}
				<div>
					<button
						type="button"
						onClick={UIActions.toggleNav}
						className="w3-button w3-hover-none w3-right w3-small w3-hide-large w3-hover-text-red"
					>
						{' '}
						×{' '}
					</button>{' '}
				</div>{' '}
				<form id="sideNavForm">
					<FileInput
						id="file-input"
						validate={this.validate}
						ready={fileIsLoaded}
						onFileChosen={this.handleFileChosen}
					/>{' '}
					{formModel.map(s => (
						<Section
							key={s.key}
							id={s.key}
							label={s.label}
							components={s.components}
							onChange={this.onChange}
							onClick={UIActions.showGroup}
							defValues={this.state}
						/>
					))}{' '}
				</form>{' '}
			</nav>
		);
	}
}
