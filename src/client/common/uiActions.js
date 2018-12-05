export default class UIAction {
	static showGroup(groupID) {
		const { id } = groupID;

		const allGroups = document.getElementsByClassName('sidebar-group');

		for (let i = 0; i < allGroups.length; i += 1) {
			if (allGroups[i].id === id) {
				if (allGroups[i].style.maxHeight && allGroups[i].style.maxHeight !== '0px') {
					allGroups[i].style.maxHeight = 0;
				} else {
					allGroups[i].style.maxHeight = `${allGroups[i].scrollHeight}px`;
				}
			} else if (allGroups[i].style.maxHeight || allGroups[i].style.maxHeight !== '0px') {
				allGroups[i].style.maxHeight = 0;
			}
		}
	}

	static toggleFileLoader() {
		const loader = document.getElementById('fileLoadIndicator');

		if (loader.className.indexOf('w3-show') > 0) {
			loader.className = loader.className.replace(' w3-show', '');
		} else {
			loader.className = `${loader.className} w3-show`;
			// myOverlayBg.style.display = 'block';
		}
	}

	static closeNav() {
		const sideNav = document.getElementById('sideNav');
		// const overlayBg = document.getElementById('overlay');

		sideNav.style.display = 'none';
		// myOverlayBg.style.display = 'none';
	}

	static toggleNav() {
		// Get the Sidenav
		const sideNav = document.getElementById('sideNav');

		// Get the DIV with overlay effect
		// var myOverlayBg = document.getElementById('overlay');

		if (sideNav.style.display === 'block') {
			sideNav.style.display = 'none';
			// myOverlayBg.style.display = 'none';
		} else {
			sideNav.style.display = 'block';
			// myOverlayBg.style.display = 'block';
		}
	}

	static enableValidate() {
		const validateButton = document.getElementById('btnValidate');
		validateButton.disabled = false;

		validateButton.className = validateButton.className.replace(' w3-disabled', '');
	}

	static openTab(e) {
		const tablinks = document.getElementsByClassName('tab_header');

		let i = 0;

		// Change theme of previous active tab
		for (i = 0; i < tablinks.length; i += 1) {
			tablinks[i].className = tablinks[i].className.replace(' w3-theme', '');
		}

		// Theme current active tab
		e.target.className += ' w3-theme';
	}
}
