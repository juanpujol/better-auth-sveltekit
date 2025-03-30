import type { Handle } from "@sveltejs/kit";
import type { User } from "$lib/models/user";
import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { sequence } from "@sveltejs/kit/hooks";
import { redirect } from "@sveltejs/kit";

const setupAuthHandler: Handle = ({ event, resolve }) => {
  return svelteKitHandler({ event, resolve, auth });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  // Redirect to login if no session and not on login page
  if (!session && !event.url.pathname.startsWith("/auth")) {
    return redirect(302, "/auth");
  }

  // Redirect to home if session and on login page
  // But allow access to sign-out route
  if (session && event.url.pathname.startsWith("/auth")) {
    // Check if it's not the sign-out route before redirecting
    if (!event.url.pathname.includes("/auth/sign-out")) {
      console.log("Redirecting from auth page to home because user has session");
      return redirect(302, "/");
    }
  }

  return resolve({ ...event, locals: { user: session?.user as User } });
};

export const handle: Handle = sequence(setupAuthHandler, authGuard);