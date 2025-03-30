// import { authClient } from "$lib/auth-client";
import { auth } from "$lib/server/auth";
import type { Actions } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
export const actions: Actions = {
  default: async ({ request, cookies }) => {
    console.log("signing in");

    const resp = await auth.api.signInSocial({
      headers: request.headers,
      cookies: cookies,
      body: {
        provider: "github",
        callbackURL: "/",
        errorCallbackURL: "/error",
        newUserCallbackURL: "/welcome",
      }
    });

    console.log(resp);

    // await authClient.signIn.social({
    //   /**
    //    * The social provider id
    //    * @example "github", "google", "apple"
    //    */
    //   provider: "github",
    //   /**
    //    * a url to redirect after the user authenticates with the provider
    //    * @default "/"
    //    */
    //   callbackURL: "/",
    //   /**
    //    * a url to redirect if an error occurs during the sign in process
    //    */
    //   errorCallbackURL: "/error",
    //   /**
    //    * a url to redirect if the user is newly registered
    //    */
    //   newUserCallbackURL: "/welcome",
    //   /**
    //    * disable the automatic redirect to the provider.
    //    * @default false
    //    */
    //   disableRedirect: true,
    // });

    redirect(302, "/");
  }
};