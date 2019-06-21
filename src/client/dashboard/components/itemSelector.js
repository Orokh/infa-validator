import React from 'react';
import PropTypes from 'prop-types';

export default function ItemSelector(props) {
	const { list, onChange, label, defaultValue } = props;

	const id = `selectFolder`;

	return (
		<div className="w3-padding w3-half">
			<span>
				{' '}
				{label}{' '}
				<select
					id={id}
					className="w3-select w3-border"
					onChange={onChange}
					disabled={list.length === 0}
				>
					<option value=""> {list.length === 0 ? 'None' : defaultValue} </option>{' '}
					{list.map(elt => (
						<option key={elt.name} value={elt.name}>
							{' '}
							{`${elt.name}`}{' '}
						</option>
					))}{' '}
				</select>{' '}
			</span>{' '}
		</div>
	);
}

ItemSelector.propTypes = {
	list: PropTypes.arrayOf(PropTypes.object).isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	defaultValue: PropTypes.string
};

ItemSelector.defaultProps = {
	defaultValue: 'All'
};
