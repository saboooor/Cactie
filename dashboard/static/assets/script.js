const modal = document.getElementById('reactionrole-modal');
const notificationList = document.getElementById('notifications');

document.addEventListener('DOMContentLoaded', () => {
	const a = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
	a.forEach(b => b.addEventListener('click', () => {
		const c = b.dataset.target;
		const d = document.getElementById(c);
		b.classList.toggle('is-active');
		d.classList.toggle('is-active');
	}));
});

// Functions to open and close a modal
function openModal(options) {
	if (options && options.channel) modal.querySelector('#channel').value = options.channel;
	if (options && options.message) modal.querySelector('#message').value = options.message;
	if (options && options.role && options.emoji && options.type && options.silent) {
		modal.querySelector('#role').value = options.role;
		modal.querySelector('#emoji').value = options.emoji;
		modal.querySelector('#type').value = options.type;
		modal.querySelector('#silent').checked = options.silent == 'true';
		modal.querySelector('.modal-card-title').innerText = 'Edit this Reaction Role';
		modal.querySelectorAll('.create-only').forEach(e => e.style.display = 'none');
		modal.querySelectorAll('.edit-only').forEach(e => e.style.display = 'flex');
	}
	else {
		modal.querySelector('.modal-card-title').innerText = 'Create a Reaction Role';
		modal.querySelectorAll('.create-only').forEach(e => e.style.display = 'flex');
		modal.querySelectorAll('.edit-only').forEach(e => e.style.display = 'none');
	}
	modal.classList.add('is-active');
}
function closeModal() { modal.classList.remove('is-active'); }

// Add a click event on various child elements to close the parent modal
document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button').forEach(close => close.addEventListener('click', () => closeModal(close.closest('.modal'))));

async function post(json) {
	const req = await fetch(window.location.pathname, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(json),
	});
	const res = await req.json();
	pushNotification(res);
	return;
}

async function settings(element) {
	if (element.type == 'checkbox') element.value = element.checked;
	await post({ [element.name]: element.value });
}

async function deleteReactionRole(element, json) {
	await post({ reactionrole: 'delete', json });
	element.parentElement.parentElement.parentElement.remove();
}

async function editReactionRole() {
	const where = {
		channelId: modal.querySelector('#channel').value,
		messageId: modal.querySelector('#message').value,
		emojiId: modal.querySelector('#emoji').value,
	};
	const set = {
		roleId: modal.querySelector('#role').value,
		type: modal.querySelector('#type').value,
		silent: modal.querySelector('#silent').checked,
	};
	await post({ reactionrole: 'edit', where, set });
	closeModal();
}

async function createReactionRole() {
	const values = {
		channelId: modal.querySelector('#channel').value,
		messageId: modal.querySelector('#message').value,
		emojiId: modal.querySelector('#emoji').value,
		roleId: modal.querySelector('#role').value,
		type: modal.querySelector('#type').value,
		silent: modal.querySelector('#silent').checked,
	};
	await post({ reactionrole: 'create', values });
	closeModal();
}

// Push Notification Function
function pushNotification(json) {
	// Create notification container
	const notification = document.createElement('div');
	notification.classList.add('notification');
	notification.classList.add(`is-${json.success ? 'success' : 'danger'}`);
	notification.style.margin = '0 10px 10px 0';

	// Create Delete Button
	const delbtn = document.createElement('a');
	delbtn.classList.add('delete');
	delbtn.addEventListener('click', () => delbtn.parentElement.remove());
	notification.appendChild(delbtn);

	// Create Inner Content
	const content = document.createElement('p');
	content.classList.add('subtitle');
	content.innerText = json.msg;
	notification.appendChild(content);

	// Add the notification to the notification list
	notificationList.appendChild(notification);
}