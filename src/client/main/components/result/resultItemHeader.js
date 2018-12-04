import React from 'react';
import PropTypes from 'prop-types';

export default function ResultItemHeader(props) {
	const { name, countErrors, countWarn } = props;

	const nbErrSpan =
		countErrors > 0 ? <span className="badge bg-error"> {countErrors} </span> : null;
	const nbWarnSpan = countWarn > 0 ? <span className="badge bg-warn"> {countWarn} </span> : null;

	return (
		<label htmlFor={name} className="collapsible-header-label">
			{' '}
			{name} {nbErrSpan} {nbWarnSpan}{' '}
		</label>
	);
}

ResultItemHeader.propTypes = {
	name: PropTypes.string.isRequired,
	countErrors: PropTypes.number.isRequired,
	countWarn: PropTypes.number.isRequired
};
