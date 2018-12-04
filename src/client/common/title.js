import React from 'react';
import UIActions from './uiActions';

function Title() {
	return (
		<div id="header" className="w3-container w3-theme-dark w3-card-2">
			<button
				type="button"
				className="w3-button w3-theme-dark w3-hover-red w3-large w3-left w3-hide-large"
				onClick={UIActions.toggleNav}
			>
				<i className="material-icons w3-large"> menu </i>{' '}
			</button>{' '}
			<span className="w3-left w3-large w3-padding w3-hover-red">
				<a className="w3-padding-left" href="/">
					<i className="material-icons w3-left w3-large"> bug_report </i>{' '}
					<span className="w3-hide-small w3-medium"> Informatica Validator </span>{' '}
				</a>{' '}
			</span>{' '}
			<a href="/dashboard.html" className="w3-button w3-theme-dark w3-hover-red w3-large">
				{' '}
				<span className="w3-medium"> Dashboard </span>{' '}
			</a>{' '}
		</div>
	);
}

export default Title;
