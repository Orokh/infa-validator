import React from 'react';
import PropTypes from 'prop-types';

function FileInput(props) {
	const { id, validate, onFileChosen, ready } = props;

	return (
		<div className="w3-padding ">
			<label
				htmlFor={id}
				className="w3-button w3-card-2 w3-margin-bottom w3-light-grey w3-hover-red w3-block w3-round-small w3-row"
			>
				<input
					id={id}
					className="hidden-input"
					type="file"
					accept=".xml"
					onChange={onFileChosen}
				/>{' '}
				<span className="material-icons w3-left w3-large"> file_upload </span>{' '}
				<span id="inputFileName"> Choose a file... </span>{' '}
				<span id="fileLoadIndicator" className="loader w3-right w3-hide" />
			</label>{' '}
			<span className="">
				<button
					id="btnValidate"
					type="button"
					className="w3-button w3-margin-bottom w3-card-2 w3-light-grey w3-hover-red w3-right w3-round-small w3-disabled"
					disabled={!ready}
					onClick={elt => validate(elt)}
				>
					Validate{' '}
				</button>{' '}
			</span>{' '}
		</div>
	);
}

FileInput.propTypes = {
	id: PropTypes.string.isRequired,
	ready: PropTypes.bool.isRequired,
	validate: PropTypes.func.isRequired,
	onFileChosen: PropTypes.func.isRequired
};

export default FileInput;
