import React from 'react';
import PropTypes from 'prop-types';

export default function ErrorList(props) {
	const { list } = props;

	const textColors = ['w3-text-green', 'w3-text-orange', 'w3-text-red'];
	const icons = ['check_circle', 'warning', 'error'];

	let listContent = '';

	if (list && list.length > 0) {
		listContent = list.map((e, idx) => (
			/* eslint react/no-array-index-key: "off" */
			<li key={idx} className={textColors[e.severity]}>
				{' '}
				<i className="material-icons icon-alert"> {icons[e.severity]} </i> {e.text}{' '}
			</li>
		));
	} else {
		listContent = (
			<li className={textColors[0]}>
				{' '}
				<i className="material-icons icon-alert"> {icons[0]} </i>
				Nothing Detected{' '}
			</li>
		);
	}

	return <ul className="w3-ul collapsible collapsed"> {listContent} </ul>;
}

ErrorList.propTypes = {
	list: PropTypes.arrayOf(PropTypes.object)
};

ErrorList.defaultProps = {
	list: []
};
