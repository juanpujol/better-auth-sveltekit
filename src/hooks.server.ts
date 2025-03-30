import type { Handle } from "@sveltejs/kit";
import type { User } from "$lib/models/user";
import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { sequence } from "@sveltejs/kit/hooks";

const authCheck: Handle = ({ event, resolve }) => {
  return svelteKitHandler({ event, resolve, auth });
};

const fetchUser: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  return resolve({ ...event, locals: { user: session?.user as User } });
};

export const handle: Handle = sequence(authCheck, fetchUser);