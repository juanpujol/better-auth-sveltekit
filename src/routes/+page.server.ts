export async function load({ locals }) {
	const user = locals.user;

	console.log('Get user from server', user);

	return { user };
}
