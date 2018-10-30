import React from 'react';
import PropTypes from 'prop-types';

import UIActions from '../uiActions';
import ResultGroup from './resultGroup';
import FolderSelector from './folderSelector';
import Tab from './tab';

export default class ResultDisplay extends React.Component {
	static propTypes = {
		result: PropTypes.instanceOf(Object)
	};

	static defaultProps = {
		result: [
			{
				name: 'N.A',
				workflows: [],
				worklets: [],
				configs: [],
				sessions: [],
				mappings: [],
				mapplets: []
			}
		]
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedFolder: 0,
			selectedType: 'workflows',
			subLevel: 'sessions'
		};

		this.onFolderChange = this.onFolderChange.bind(this);

		this.structure = [
			{
				id: 'tabWorkflows',
				label: 'Workflows',
				level1: 'workflows',
				level2: 'sessions'
			},
			{
				id: 'tabWorklets',
				label: 'Worklets',
				level1: 'worklets',
				level2: 'sessions'
			},
			{
				id: 'tabSessions',
				label: 'Sessions',
				level1: 'sessions'
			},
			{
				id: 'tabConfigs',
				label: 'Config',
				level1: 'configs'
			},
			{
				id: 'tabMappings',
				label: 'Mappings',
				level1: 'mappings',
				level2: 'transformations'
			},
			{
				id: 'tabMapplets',
				label: 'Mapplets',
				level1: 'mapplets',
				level2: 'transformations'
			}
		];

		this.onTabClick = this.onTabClick.bind(this);
	}

	onTabClick(evt) {
		UIActions.openTab(evt);

		const newLevel = this.structure.find(e => e.id === evt.target.id);

		this.setState({
			selectedType: newLevel.level1,
			subLevel: newLevel.level2 || ''
		});
	}

	onFolderChange(e) {
		this.setState({
			selectedFolder: e.target.value
		});
	}

	render() {
		const { result } = this.props;
		const { selectedFolder, selectedType, subLevel } = this.state;

		return (
			<div className="w3-container">
				<FolderSelector onChange={this.onFolderChange} list={result} key="selectedFolder" />{' '}
				<div className="w3-bar w3-theme-l2 w3-text-white">
					{' '}
					{this.structure.map((e, idx) => (
						<Tab
							label={e.label}
							key={e.id}
							targetID={e.id}
							order={idx}
							level1={e.level1}
							onClick={this.onTabClick}
						/>
					))}{' '}
				</div>{' '}
				<div
					id="treeView_Workflows"
					className="treeView w3-container w3-white w3-padding w3-margin-bottom"
				>
					<ResultGroup
						groupL1={result[selectedFolder][selectedType]}
						groupL2Name={subLevel}
					/>{' '}
				</div>{' '}
			</div>
		);
	}
}
