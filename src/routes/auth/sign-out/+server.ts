import { auth } from "$lib/server/auth";
import { redirect, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, cookies }: RequestEvent): Promise<Response> {
  try {
    await auth.api.signOut({
      headers: request.headers,
      cookies,
    });
  } catch (err) {
    console.error(err);
  } finally {
    redirect(302, "/auth");
  }
}