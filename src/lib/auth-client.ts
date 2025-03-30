import { page } from "$app/state"
import { emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient as createBetterAuthClient } from "better-auth/svelte"

export function createAuthClient(baseURL: string = page.url.origin) {
  return createBetterAuthClient({
    baseURL,
    plugins: [emailOTPClient()],
  })
}