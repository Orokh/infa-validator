import React from 'react';
import PropTypes from 'prop-types';

import ErrorList from './errorList';
import ResultSubGroup from './resultSubGroup';

export default function ResultGroup(props) {
	const { group, subGroupName } = props;
	let content = '';

	// No result yet
	if (group.length === 0) {
		content = <li> No item to be analyzed in this group </li>;
	} else {
		// Level 1 group

		let subGroups = [];
		let countError = 0;

		if (subGroupName.length > 0) {
			subGroups = group.map(elt => <ResultSubGroup group={elt[subGroupName]} />);

			countError = group.map(
				elt =>
					elt.errors.length +
					elt[subGroupName].reduce((acc, curr) => acc + curr.errors.length, 0)
			);
		} else {
			countError = group.map(elt => elt.errors.length);
		}

		content = group.map((elt, idx) => (
			<li key={elt.name}>
				<input id={elt.name} className="collapsible-header" type="checkbox" />
				<label htmlFor={elt.name} className="collapsible-header-label">
					{' '}
					{`${elt.name} (${countError[idx]})`}{' '}
				</label>{' '}
				<div className="collapsible-content">
					<ErrorList list={elt.errors} /> {subGroups[idx]}{' '}
				</div>{' '}
			</li>
		));
	}

	return (
		<div>
			<ul className="w3-ul"> {content} </ul>{' '}
		</div>
	);
}

ResultGroup.propTypes = {
	group: PropTypes.arrayOf(PropTypes.object).isRequired,
	subGroupName: PropTypes.string
};

ResultGroup.defaultProps = {
	subGroupName: ''
};
