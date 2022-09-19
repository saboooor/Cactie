document.addEventListener('DOMContentLoaded', () => {
	const a = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
	a.forEach(b => {
		b.addEventListener('click', () => {
			const c = b.dataset.target;
			const d = document.getElementById(c);
			b.classList.toggle('is-active');
			d.classList.toggle('is-active');
		});
	});
});

// Functions to open and close a modal
function openModal(element, options) {
	if (options && options.channel) document.getElementsByName('channel')[0].value = options.channel;
	if (options && options.message) document.getElementsByName('message')[0].value = options.message;
	if (options && options.role && options.emoji && options.type && options.silent) {
		document.getElementsByName('role')[0].value = options.role;
		document.getElementsByName('emoji')[0].value = options.emoji;
		document.getElementsByName('type')[0].value = options.type;
		document.getElementsByName('silent')[0].checked = options.silent == 'true';
		document.querySelector('.modal-card-title').innerText = 'Edit this Reaction Role';
		document.querySelectorAll('.create-only').forEach(e => e.style.display = 'none');
		document.querySelectorAll('.edit-only').forEach(e => e.style.display = 'block');
	}
	else {
		document.querySelector('.modal-card-title').innerText = 'Create a Reaction Role';
		document.querySelectorAll('.create-only').forEach(e => e.style.display = 'block');
		document.querySelectorAll('.edit-only').forEach(e => e.style.display = 'none');
	}
	element.classList.add('is-active');
}

function closeModal(element) { element.classList.remove('is-active'); }

// Add a click event on various child elements to close the parent modal
document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button').forEach($close => {
	const $target = $close.closest('.modal');

	$close.addEventListener('click', () => {
		closeModal($target);
	});
});

// Hide the parent element of an x button
function hide(event) { event.srcElement.parentElement.style.display = 'none'; }

const urlParams = new URLSearchParams(window.location.search);
const alert = urlParams.get('alert');

const notificationList = document.getElementById('notifications');
if (notificationList && alert) {
	notificationList.innerHTML = `
		<div class="notification" style="margin: 0 10px 10px 0;">
			<a class="delete" onclick="hide(event)"></a>
			<p><strong style="color: white">${alert}</strong></p>
		</div>
	`;
}