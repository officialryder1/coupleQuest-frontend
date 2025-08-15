<script>
  import { fetchAPI } from "$lib/api";
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false)
  let showPassword = $state(false);

  let { form } = $props();

  async function handleLogin(e) {
    e.preventDefault()
    loading = true;

    // try {
    //   const data = await fetchAPI('user/login/', 'POST', { email, password });
    //   console.log(data)
    //   if (data?.refresh) {
    //     localStorage.setItem('access_token', data.access);
    //     window.location.href = '/dashboard';
    //   }
    //   if (data?.detail) {
    //     error = data?.detail
    //   }
      
    // } catch (err) {
    //   error = 'Server error, please try again later';
    // } finally {
		// 	loading = false;
		// }
  }

</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-100">
  <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

    {#if form?.error}
      <div class="alert alert-error m-5">{form?.error}</div>
    {/if}
    <form method="POST">
    <div class="space-y-5">
      <div class="relative">
        <input
          type="email"
          bind:value={email}
          name="email"
          placeholder="Email"
          class="input input-bordered w-full pl-12 text-white"
          required
        />
        <span class="absolute left-4 top-3 text-gray-400">
          📧
        </span>
      </div>

      <div class="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          bind:value={password}
          name="password"
          placeholder="Password"
          class="input input-bordered w-full pl-12 pr-12 text-white"
          required
        />
        <span class="absolute left-4 top-3 text-gray-400">
          🔒
        </span>
        <button
          type="button"
          class="absolute right-3 top-2 text-sm  text-gray-50 hover:text-gray-300 badge badge-secondary"
          onclick={() => (showPassword = !showPassword)}
        >
          {showPassword ? 'hide' : '👀'}
        </button>
      </div>
      
      <button class="btn btn-secondary w-full flex justify-center" disabled={loading}>
        {#if loading}
        <span class="loading loading-spinner">submitting...</span>
				{:else}
        Login
				{/if}
			</button>
    
    

      <p class="text-center text-sm text-gray-600">
        Don't have an account?
        <a href="/register" class="text-secondary font-medium hover:underline">Sign up</a>
      </p>
    </div>
  </form>
  </div>
</div>
