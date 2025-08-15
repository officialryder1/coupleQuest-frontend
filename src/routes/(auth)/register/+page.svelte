<script>
  let { form } = $props()

  let email = $state('');
  let username = $state('');
  let password = $state('');
  let error = $state(form?.error)
  let loading = $state(false)
  let showPassword = $state(false)

  async function handleRegister() {
    if (!email.trim()) return

    loading = true;
   
    try {
      const data = await fetchAPI('user/register/', 'POST', { email, username, password });
      console.log(data)
      if(data?.email) {
        error = data?.email
        console.log(error)
      } else {
          window.location.href = '/login';
      }
    } catch (err) {
      error = 'Server error, Please try again later';
    } finally {
			loading = false;
		}
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-100">
  <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 text-white">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

    {#if error}
      <div class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
    {/if}

    <form method="POST">x
    <div class="space-y-5">
      <div class="relative">
        <input
          type="email"
          name="email"
          bind:value={email}
          placeholder="Email"
          class="input input-bordered w-full pl-12 "
        />
        <span class="absolute left-4 top-3 text-gray-400">📧</span>
      </div>

      <div class="relative">
        <input
          type="text"
          name="username"
          bind:value={username}
          placeholder="Username"
          class="input input-bordered w-full pl-12 "
        />
        <span class="absolute left-4 top-3 text-gray-400">👤</span>
      </div>

      <div class="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          bind:value={password}
          placeholder="Password"
          class="input input-bordered w-full pl-12 pr-12"
        />
        <span class="absolute left-4 top-3 text-gray-400">🔒</span>
        <button
          type="button"
          class="absolute right-3 top-2 text-sm text-gray-50 hover:text-gray-200"
          onclick={() => (showPassword = !showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <button class="btn btn-secondary w-full flex justify-center" disabled={loading}>
				{#if loading}
					<span class="loading loading-spinner"></span>
				{:else}
					register
				{/if}
			</button>

      <p class="text-center text-sm text-gray-600">
        Already have an account?
        <a href="/login" class="text-secondary font-medium hover:underline">Login</a>
      </p>
    </div>
  </form>
  </div>
</div>
