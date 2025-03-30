import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET } from '$env/static/private';

export const auth = betterAuth({
  appName: "BetterAuth SvelteKit Example",
  emailAndPassword: {
    enabled: false
  },
  socialProviders: {
    github: {
      clientId: OAUTH_GITHUB_CLIENT_ID,
      clientSecret: OAUTH_GITHUB_CLIENT_SECRET
    }
  },
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	})
});
