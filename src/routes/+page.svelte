<script lang="ts">
  import { authClient } from "$lib/auth-client";

  async function signOut() {
    await authClient.signOut();
  }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form method="post" action="/auth/sign-out">
  <button type="submit">Sign out</button>
</form>
