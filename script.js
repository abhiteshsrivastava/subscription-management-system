(() => {
	const sections = Array.from(document.querySelectorAll('main > section'));
	const validSections = new Set(sections.map(section => section.id));
	const params = new URLSearchParams(window.location.search);
	const requestedRole = params.get('role');
	const requestedMode = params.get('mode');
	const roleSelect = document.getElementById('user-role');
	const registerRole = document.getElementById('new-role');

	function showSection(sectionId, updateAddress = true) {
		const selectedId = validSections.has(sectionId) ? sectionId : 'role-selection';
		sections.forEach(section => {
			section.hidden = section.id !== selectedId;
		});

		if (updateAddress) {
			window.history.replaceState(null, '', `#${selectedId}`);
		}
	}

	function showFeedback(form, message) {
		let feedback = form.querySelector('[data-auth-feedback]');
		if (!feedback) {
			feedback = document.createElement('p');
			feedback.dataset.authFeedback = '';
			feedback.setAttribute('role', 'status');
			feedback.setAttribute('aria-live', 'polite');
			form.append(feedback);
		}
		feedback.textContent = message;
	}

	if (requestedRole && roleSelect) {
		const matchingRole = Array.from(roleSelect.options)
			.find(option => option.value === requestedRole);
		if (matchingRole) roleSelect.value = matchingRole.value;
	}

	if (requestedRole && registerRole) {
		const matchingRole = Array.from(registerRole.options)
			.find(option => option.value === requestedRole);
		if (matchingRole) registerRole.value = matchingRole.value;
	}

	const initialHash = window.location.hash.slice(1);
	const initialSection = validSections.has(initialHash)
		? initialHash
		: requestedMode === 'register' || requestedMode === 'login'
			? requestedMode
			: 'role-selection';
	showSection(initialSection, false);

	document.addEventListener('click', event => {
		const link = event.target.closest('a[href^="#"]');
		if (!link) return;

		const sectionId = link.getAttribute('href').slice(1);
		if (!validSections.has(sectionId)) return;

		event.preventDefault();
		showSection(sectionId);
		document.getElementById(sectionId)?.querySelector('input, select, button')?.focus();
	});

	roleSelect?.addEventListener('change', () => showSection('login'));

	const registerForm = document.querySelector('#register form');
	const password = document.getElementById('new-password');
	const confirmPassword = document.getElementById('confirm-password');

	confirmPassword?.addEventListener('input', () => confirmPassword.setCustomValidity(''));

	sections.forEach(section => {
		const form = section.querySelector('form');
		if (!form) return;

		form.addEventListener('submit', event => {
			event.preventDefault();

			if (form === registerForm && password && confirmPassword) {
				if (password.value !== confirmPassword.value) {
					confirmPassword.setCustomValidity('Passwords do not match.');
					confirmPassword.reportValidity();
					return;
				}
			}

			const messages = {
				login: 'Sign-in is not connected to an account service yet. Your details were not sent or saved.',
				register: 'Registration is not connected to an account service yet. Your details were not sent or saved.',
				reset: 'Password reset requires an email service, which is not configured yet.',
				'new-password-section': 'Password updates require a verified reset link, which is not configured yet.'
			};
			showFeedback(form, messages[section.id] || 'Choose an account role to continue.');
		});
	});
})();

