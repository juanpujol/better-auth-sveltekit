<script lang="ts">
	let { data } = $props();
</script>

<div class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify your OTP</h2>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
			<div class="space-y-6">
				<form method="post" action="/auth/verify-otp" class="space-y-6">
					<input id="email" name="email" type="hidden" value={data.email} required />

					<div>
						<label for="otp" class="block text-sm font-medium text-gray-700"> OTP </label>
						<div class="mt-1">
							<input
								id="otp"
								name="otp"
								type="text"
								class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
						>
							Sign in/up
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
