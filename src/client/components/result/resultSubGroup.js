import React from 'react';
import PropTypes from 'prop-types';

import ErrorList from './errorList';

export default function ResultGroup(props) {
	const { group } = props;

	const countError = group.map(elt => elt.errors.length);
	const errorList = group.map(
		elt =>
			elt.errors.length > 0 ? (
				<div className="collapsible-content">
					<ErrorList list={elt.errors} />{' '}
				</div>
			) : (
				''
			)
	);

	return (
		<div>
			<ul className="w3-ul">
				{' '}
				{group.map((elt, idx) => (
					<li key={elt.name}>
						{' '}
						<input id={elt.name} className="collapsible-header" type="checkbox" />
						<label
							htmlFor={elt.name}
							className={countError[idx] > 0 ? 'collapsible-header-label' : ''}
						>
							{' '}
							{`${elt.name} (${countError[idx]})`}{' '}
						</label>{' '}
						{errorList[idx]}{' '}
					</li>
				))}{' '}
			</ul>{' '}
		</div>
	);
}

ResultGroup.propTypes = {
	group: PropTypes.arrayOf(PropTypes.object).isRequired
};
