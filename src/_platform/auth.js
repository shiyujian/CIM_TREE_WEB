import cookie from 'js-cookie';

export default () => {
	return !!cookie.get('id');
};

export const getUser = () => {
	const permissions = cookie.get('permissions') || '[]';
	return {
		username: cookie.get('username'),
		id: +cookie.get('id'),
		name: cookie.get('name'),
		org: cookie.get('org'),
		tasks: cookie.get('tasks'),
		password: cookie.get('password'),
		code: cookie.get('code'),
		is_superuser: cookie.get('is_superuser') !== 'false',
		org_code: cookie.get('org_code')
	};
};

export const setUser = (username, id, name, org, tasks, password, code, is_superuser, org_code) => {
	cookie.set('username', username);
	cookie.set('id', id);
	cookie.set('name', name);
	cookie.set('org', org);
	cookie.set('tasks', tasks);
	cookie.set('password', password);
	cookie.set('code', code);
	cookie.set('is_superuser', is_superuser);
	cookie.set('org_code', org_code);
};

export const clearUser = () => {
	cookie.remove('username');
	cookie.remove('id');
	cookie.remove('name');
	cookie.remove('org');
	cookie.remove('tasks');
	cookie.remove('password');
	cookie.remove('code');
	cookie.remove('is_superuser');
	cookie.remove('org_code');
};

export const clearCookies = () => {
	const cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
};

export const setPermissions = (permissions) => {
	const text = JSON.stringify(permissions);
	window.localStorage.setItem('permissions', text)
};

export const getPermissions = () => {
	let permissions = [];
	const text = window.localStorage.getItem('permissions');
	try {
		permissions = JSON.parse(text);
	} catch (e) {

	}
	return permissions;
};

export const removePermissions = () => {
	window.localStorage.removeItem('permissions');
};