import React from 'react';
import PropTypes from 'prop-types';

export default function FormComponent(props) {
	const { id, type = 'text', label, cmpProps = {}, onChange, defValue } = props;

	const checked = {};

	if (type === 'checkbox' && defValue === true) {
		checked.defaultChecked = 'defaultChecked';
	}

	return (
		<div id={id} key={id} className="w3-row w3-margin-top w3-padding-bottom w3-margin-bottom">
			{' '}
			<label key={`l${id}`} htmlFor={`i${id}`}>
				{' '}
				<span className="w3-half"> {label} </span>{' '}
			</label>{' '}
			<input
				{...cmpProps}
				type={type}
				id={`i${id}`}
				key={`i${id}`}
				defaultValue={defValue}
				{...checked}
				className="w3-half w3-border w3-light-grey"
				onChange={e => onChange(e, id)}
			/>{' '}
		</div>
	);
}

FormComponent.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	type: PropTypes.string,
	cmpProps: PropTypes.instanceOf(Object)
};

FormComponent.defaultProps = {
	type: 'text',
	cmpProps: {}
};
