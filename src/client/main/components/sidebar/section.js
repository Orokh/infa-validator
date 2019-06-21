import React from 'react';
import PropTypes from 'prop-types';
import FormComponent from './formComponent';

export default function Section(props) {
	const { id, label, components, defValues, onChange, onClick } = props;

	return (
		<div>
			<button
				className="w3-button w3-cell-left w3-theme w3-block w3-hover-red w3-left-align w3-border-top"
				onClick={() =>
					onClick({
						id
					})
				}
				type="button"
			>
				{label}{' '}
			</button>{' '}
			<div id={id} className="sidebar-group w3-row-padding">
				{' '}
				{components.map(e => (
					<FormComponent
						key={e.key}
						id={e.key}
						{...e}
						defValue={defValues[e.key]}
						onChange={elt => onChange(elt, e.key)}
					/>
				))}{' '}
			</div>{' '}
		</div>
	);
}

Section.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	components: PropTypes.arrayOf(PropTypes.object).isRequired,
	defValues: PropTypes.instanceOf(Object),
	onChange: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired
};

Section.defaultProps = {
	defValues: {}
};
