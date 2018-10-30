import React from 'react';
import PropTypes from 'prop-types';

export default function Tab(props) {
	const { label, targetID, order, onClick } = props;

	let className = 'tab_header w3-bar-item w3-button w3-hover-red';
	if (order === 0) {
		className += ' w3-theme';
	}

	return (
		<button className={className} type="button" id={targetID} onClick={e => onClick(e)}>
			{' '}
			{label}{' '}
		</button>
	);
}

Tab.propTypes = {
	label: PropTypes.string.isRequired,
	targetID: PropTypes.string.isRequired,
	order: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired
};
