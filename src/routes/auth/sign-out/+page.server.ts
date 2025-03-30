import { auth, clearCookies } from "$lib/server/auth";
import type { Actions } from "@sveltejs/kit";
import { error, redirect } from "@sveltejs/kit";

export async function load() {
  error(404, "Not found");
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    console.log("signing out");

    try {
      // Sign out the user
      await auth.api.signOut({
        headers: request.headers,
        cookies: cookies,
      });

      // Delete the session cookie
      clearCookies(cookies);
    } catch (err) {
      console.error(err);
    } finally {
      redirect(302, "/auth");
    }
  }
};
