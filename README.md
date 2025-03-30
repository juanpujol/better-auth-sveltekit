# Better Auth SvelteKit Example

This project demonstrates the implementation of authentication in a SvelteKit application using the `better-auth` library. It showcases various authentication flows including OAuth with GitHub and Email OTP (One-Time Password) authentication.

## Features

- 🔒 GitHub OAuth Authentication
- 📧 Email OTP Authentication
- 🛡️ Session Management
- 🔄 Route Protection
- 📦 SQLite Database Integration with Drizzle ORM

## Project Structure

```
better-auth-sveltekit/
├── src/
│   ├── lib/
│   │   ├── models/           # Data models
│   │   │   └── user.ts       # User interface definition
│   │   ├── server/
│   │   │   ├── auth.ts       # Better-auth configuration
│   │   │   ├── email.ts      # Email service using AWS SES
│   │   │   └── db/           # Database connection and schemas
│   │   └── auth-client.ts    # Client-side auth utilities
│   ├── hooks.server.ts       # SvelteKit hooks for auth middleware
│   └── routes/
│       ├── auth/             # Authentication routes
│       │   ├── oauth/        # OAuth provider routes (GitHub)
│       │   ├── verify-otp/   # OTP verification
│       │   └── sign-out/     # Sign out functionality
│       └── +page.svelte      # Protected home page
└── drizzle.config.ts        # Drizzle ORM configuration
```

## Authentication Flows

### 1. GitHub OAuth Authentication

This project implements OAuth authentication with GitHub, allowing users to sign in with their GitHub accounts. The flow works as follows:

1. User clicks "Continue with GitHub" on the authentication page
2. User is redirected to GitHub to authorize the application
3. GitHub redirects back to the application with an authorization code
4. The application exchanges the code for access tokens
5. User session is created and user is redirected to the home page

### 2. Email OTP Authentication

The Email OTP flow provides a passwordless authentication method:

1. User enters their email address on the authentication page
2. A one-time password (OTP) is generated and sent to the user's email via AWS SES
3. User enters the OTP on the verification page
4. The application verifies the OTP and creates a session
5. User is redirected to the home page

## Better-Auth Integration

This project demonstrates how to integrate the `better-auth` library with SvelteKit, including:

### Server-Side Configuration

```typescript
// src/lib/server/auth.ts
export const auth = betterAuth({
	appName: 'BetterAuth SvelteKit Example',
	advanced: {
		cookiePrefix
	},
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
	}),
	plugins: [
		sveltekitCookies(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				// Email sending logic
			}
		})
	]
});
```

### Client-Side Integration

```typescript
// src/lib/auth-client.ts
export function createAuthClient(baseURL: string = page.url.origin) {
	return createBetterAuthClient({
		baseURL,
		plugins: [emailOTPClient()]
	});
}
```

### SvelteKit Hooks

```typescript
// src/hooks.server.ts
const setupAuthHandler: Handle = ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth });
};

const authGuard: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	// Route protection logic
	// ...
};

export const handle: Handle = sequence(setupAuthHandler, authGuard);
```

## Database Integration

This project uses Drizzle ORM with SQLite to store user data and sessions:

```typescript
// src/lib/server/db/schemas/auth-schema.ts
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const session = sqliteTable('session', {
	// Session schema
});

export const account = sqliteTable('account', {
	// Account schema
});

export const verification = sqliteTable('verification', {
	// Verification tokens schema
});
```

## Setup and Configuration

### Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=file:./local.db
OAUTH_GITHUB_CLIENT_ID=your_github_client_id
OAUTH_GITHUB_CLIENT_SECRET=your_github_client_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
```

### Installation

```bash
# Install dependencies
npm install

# Create database schema
npm run db:push

# Start development server
npm run dev
```

## Key Components

### Authentication Guard

The authentication guard in `hooks.server.ts` protects routes by checking for an active session:

```typescript
// Redirect to login if no session and not on login page
if (!session && !event.url.pathname.startsWith('/auth')) {
	return redirect(302, '/auth');
}

// Redirect to home if session and on login page
if (session && event.url.pathname.startsWith('/auth')) {
	// Check if it's not the sign-out route before redirecting
	if (!event.url.pathname.includes('/auth/sign-out')) {
		return redirect(302, '/');
	}
}
```

### Email OTP Flow

The email OTP workflow is implemented with these main components:

1. Authentication page for email input
2. OTP verification page
3. Email sending service using AWS SES
4. OTP verification API integrated with better-auth

## Contributing

Contributions are welcome! This project serves as an example implementation of better-auth with SvelteKit. Feel free to submit issues or pull requests.

## License

MIT
