<script lang="ts">
  import { authClient } from "$lib/auth-client"
  import { goto } from "$app/navigation";
  let { data } = $props();

  async function signInWithOTP(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const otp = formData.get("otp") as string;

    const { error } = await authClient.signIn.emailOtp({
      email,
      otp,
      fetchOptions: {
        onSuccess: () => {
          goto("/");
        },
      },
    })

    if (error) {
      console.error(error);
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Verify your OTP
    </h2>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div class="space-y-6">
        <form method="post" action="/auth/verify-otp" class="space-y-6">
          <input id="email" name="email" type="hidden" value={data.email} required />

          <div>
            <label for="otp" class="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <div class="mt-1">
              <input
                id="otp"
                name="otp"
                type="text"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in/up
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
