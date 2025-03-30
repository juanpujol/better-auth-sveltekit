import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const email = cookies.get('otp_email');

	if (!email) {
		return redirect(302, '/auth');
	}

	return { email };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const otp = formData.get('otp') as string;

		if (!email || !otp) {
			return fail(400, { email, otp, missing: true });
		}

		const { token, user } = await auth.api.signInEmailOTP({
			body: {
				email,
				otp,
				type: 'sign-in'
			}
		});

		if (!token || !user) {
			return fail(400, { email, otp, missing: true });
		}

		// Clear the email from cookies
		cookies.set('otp_email', '', { maxAge: 0, path: '/auth/verify-otp' });

		// Redirect to the home page
		return redirect(302, '/');
	}
};
