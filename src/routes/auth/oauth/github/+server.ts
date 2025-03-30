import { auth } from '$lib/server/auth'
import { error, redirect } from '@sveltejs/kit'

export async function GET(): Promise<Response> {
	console.log("signing in");

  const response = await auth.api.signInSocial({
    body: {
      provider: "github",
      disableRedirect: true,
      callbackURL: "/api/auth/callback/github"
    }
  });

  if (!response.url) {
    return error(500, "No URL returned");
  }

  console.log(response.url.toString());

  // redirect to the response url
  return redirect(302, response.url.toString());

  // let redirectUrl = undefined;

  // try {
  //   const response = await auth.api.signInSocial({
  //     headers: request.headers,
  //     cookies: cookies,
  //     redirect: false,
  //     body: {
  //       provider: "github",
  //       callbackURL: "http://localhost:3000/api/auth/callback/github",
  //     }
  //   });

  //   if (!response.url) {
  //     throw new Error("No URL returned");
  //   }

  //   redirectUrl = response.url.toString();
  // } catch (err) {
  //   console.error('Error signing in', err);

  //   error(500, "Internal server error");
  // }

  // if (redirectUrl) {
  //   redirect(302, redirectUrl);
  // }

  // return new Response("No redirect URL", { status: 400 });

  // redirect(302, "https://www.google.com");

}
