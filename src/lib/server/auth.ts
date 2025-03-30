import { betterAuth, type BetterAuthPlugin } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import { createAuthMiddleware, emailOTP } from 'better-auth/plugins';
import { sendEmail } from './email';
import { parseSetCookieHeader } from 'better-auth/cookies';
const cookiePrefix = "sveltekit";

const sveltekitCookies = (): BetterAuthPlugin => ({
	id: 'sveltekit-cookies',
	hooks: {
		after: [
			{
				matcher() {
					return true;
				},
				handler: createAuthMiddleware(async (ctx) => {
					const returned = ctx.context.responseHeaders;
					if ('_flag' in ctx && ctx._flag === 'router') {
						return;
					}
					if (returned instanceof Headers) {
						const setCookies = returned?.get('set-cookie');
						if (!setCookies) return;
						const parsed = parseSetCookieHeader(setCookies);
						const { getRequestEvent } = await import('$app/server');
						const event = await getRequestEvent();
						parsed.forEach((value, key) => {
							if (!key) return;
							const opts = {
								sameSite: value.samesite,
								secure: value.secure,
								maxAge: value['max-age'],
								httpOnly: value.httponly,
								domain: value.domain,
								path: value.path || '/'
							};
							try {
								event.cookies.set(key, decodeURIComponent(value.value), opts);
							} catch (_e) {
								console.error("error setting cookie", _e);
								// this will fail if the cookie is being set on server component
							}
						});
						return;
					}
				})
			}
		]
	}
});

export const auth = betterAuth({
  appName: "BetterAuth SvelteKit Example",
  advanced: {
    cookiePrefix,
  },
  emailAndPassword: {
    enabled: false
  },
  socialProviders: {
    github: {
      clientId: OAUTH_GITHUB_CLIENT_ID,
      clientSecret: OAUTH_GITHUB_CLIENT_SECRET,
    }
  },
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),
  plugins: [
    sveltekitCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type}) {
        if (type === "sign-in") {
          await sendEmail({
            from: "Support <support@laiki.com.br>",
            to: email,
            subject: "Your access code",
            body: {
              text: `Your access code is:\n\n${otp}\n\nSupport.`,
              html: `
              <p>Your access code is:</p>
              <p><strong>${otp}</strong></p>
              <p>Support Laiki.</p>
              `,
            },
          });
        }
      },
    })
  ]
});

export function clearCookies(cookies: Cookies) {
  cookies.delete(`${cookiePrefix}.session_token`, { path: "/" });
}
