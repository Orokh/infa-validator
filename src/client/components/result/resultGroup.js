import React from 'react';
import PropTypes from 'prop-types';

import ErrorList from './errorList';

export default function ResultGroup(props) {
	const { groupL1, groupL2Name } = props;
	let ret = '';

	if (groupL1.length === 0) {
		ret = (
			<div>
				<ul className="w3-ul">
					<li> No item to be analyzed in this group </li>{' '}
				</ul>{' '}
			</div>
		);
	} else if (groupL2Name !== '') {
		ret = (
			<div>
				<ul className="w3-ul">
					{' '}
					{groupL1.map(i => (
						<li key={i.name}>
							{' '}
							{i.name} <ErrorList list={i.errors} />{' '}
							<ResultGroup groupL1={i[groupL2Name]} />{' '}
						</li>
					))}{' '}
				</ul>{' '}
			</div>
		);
	} else {
		ret = (
			<div>
				<ul className="w3-ul">
					{' '}
					{groupL1.map(i => (
						<li key={i.name}>
							{' '}
							{i.name} <ErrorList list={i.errors} />{' '}
						</li>
					))}{' '}
				</ul>{' '}
			</div>
		);
	}
	return ret;
}

ResultGroup.propTypes = {
	groupL1: PropTypes.arrayOf(PropTypes.object).isRequired,
	groupL2Name: PropTypes.string
};

ResultGroup.defaultProps = {
	groupL2Name: ''
};
