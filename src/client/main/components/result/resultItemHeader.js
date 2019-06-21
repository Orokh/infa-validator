import React from 'react';
import PropTypes from 'prop-types';

export default function ResultItemHeader(props) {
	const { parentName, name, countErrors, countWarn } = props;

	const nbErrSpan =
		countErrors > 0 ? <span className="badge bg-error"> {countErrors} </span> : null;
	const nbWarnSpan = countWarn > 0 ? <span className="badge bg-warn"> {countWarn} </span> : null;

	return (
		<label htmlFor={`${parentName}#${name}`} className="collapsible-header-label">
			{' '}
			{name} {nbErrSpan} {nbWarnSpan}{' '}
		</label>
	);
}

ResultItemHeader.propTypes = {
	parentName: PropTypes.string,
	name: PropTypes.string.isRequired,
	countErrors: PropTypes.number.isRequired,
	countWarn: PropTypes.number.isRequired
};

ResultItemHeader.defaultProps = {
	parentName: ''
};
