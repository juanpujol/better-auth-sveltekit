import { auth } from '$lib/server/auth';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		console.log('signing in');

		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const { success } = await auth.api.sendVerificationOTP({
			body: {
				email,
				type: 'sign-in'
			}
		});

		if (!success) {
			return fail(500, { email, serverError: true });
		}

		// Set email in cookies to use in the verify page
		cookies.set('otp_email', email, {
			maxAge: 600, // 10 minutes
			path: '/auth/verify-otp'
		});

		return redirect(302, '/auth/verify-otp');
	}
};
