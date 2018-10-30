import React from 'react';
import UIActions from './uiActions';

function Title() {
	return (
		<div id="header" className="w3-container w3-theme-dark w3-card-2 w3-hide-large">
			<button
				type="button"
				className="w3-button w3-theme-dark w3-hover-red w3-large w3-left"
				onClick={UIActions.toggleNav}
			>
				<i className="material-icons w3-large"> menu </i>{' '}
			</button>{' '}
			<span className="w3-right w3-large w3-padding">
				<i className="material-icons w3-left w3-xlarge"> bug_report </i>{' '}
				<span className="w3-hide-small w3-padding-left txt-normal">
					{' '}
					Informatica Validator{' '}
				</span>{' '}
			</span>{' '}
		</div>
	);
}

export default Title;
