import React from 'react';
import PropTypes from 'prop-types';

export default function FolderSelector(props) {
	const { list, onChange } = props;

	return (
		<select className="w3-select w3-third w3-margin w3-card-2" onChange={onChange}>
			{' '}
			{list.map((elt, idx) => (
				<option key={elt.name} value={idx}>
					{' '}
					{`${elt.name} (${elt.countErrors}|${elt.countWarn})`}{' '}
				</option>
			))}{' '}
		</select>
	);
}

FolderSelector.propTypes = {
	list: PropTypes.arrayOf(PropTypes.object),
	onChange: PropTypes.func.isRequired
};

FolderSelector.defaultProps = {
	list: [
		{
			name: 'N.A'
		}
	]
};
