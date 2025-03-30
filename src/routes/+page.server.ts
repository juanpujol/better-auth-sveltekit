import { auth } from "$lib/server/auth";

export async function load({ request }) {
  const user = await auth.api.getSession({
    headers: request.headers,
  })

  console.log(user);

  return { user };
}
