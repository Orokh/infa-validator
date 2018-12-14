import React from 'react';
import PropTypes from 'prop-types';

import ErrorList from './errorList';
import ResultItemHeader from './resultItemHeader';

export default function ResultGroup(props) {
	const { parentName, group } = props;

	const errorList = group.map(elt => (
		<div className="collapsible-content">
			<ErrorList list={elt.errors} />{' '}
		</div>
	));

	return (
		<div>
			<ul className="w3-ul">
				{' '}
				{group.map((elt, idx) => (
					<li key={elt.name}>
						{' '}
						<input
							id={`${parentName}#${elt.name}`}
							className="collapsible-header"
							type="checkbox"
						/>
						<ResultItemHeader
							parentName={parentName}
							name={elt.name}
							countErrors={elt.countErrors}
							countWarn={elt.countWarn}
						/>{' '}
						{errorList[idx]}{' '}
					</li>
				))}{' '}
			</ul>{' '}
		</div>
	);
}

ResultGroup.propTypes = {
	group: PropTypes.arrayOf(PropTypes.object).isRequired,
	parentName: PropTypes.string.isRequired
};
