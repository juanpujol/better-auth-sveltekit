import type { Handle } from "@sveltejs/kit";

import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { sequence } from "@sveltejs/kit/hooks";

export const authCheck: Handle = ({ event, resolve }) => {
  return svelteKitHandler({ event, resolve, auth });
};

export const handle: Handle = sequence(authCheck);