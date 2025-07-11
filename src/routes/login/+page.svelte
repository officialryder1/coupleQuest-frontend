<script>
  import { fetchAPI } from "$lib/api";
  let email = '';
  let password = '';
  let error = '';
  let showPassword = false;

  async function handleLogin() {
    try {
      const data = await fetchAPI('user/login/', 'POST', { email, password });
      localStorage.setItem('access_token', data.access);
      window.location.href = '/dashboard';
    } catch (err) {
      error = 'Invalid email or password';
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-100">
  <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

    {#if error}
      <div class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
    {/if}

    <div class="space-y-5">
      <div class="relative">
        <input
          type="email"
          bind:value={email}
          placeholder="Email"
          class="input input-bordered w-full pl-12"
        />
        <span class="absolute left-4 top-3 text-gray-400">
          📧
        </span>
      </div>

      <div class="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          bind:value={password}
          placeholder="Password"
          class="input input-bordered w-full pl-12 pr-12"
        />
        <span class="absolute left-4 top-3 text-gray-400">
          🔒
        </span>
        <button
          type="button"
          class="absolute right-3 top-2 text-sm  text-gray-50 hover:text-gray-300 badge badge-secondary"
          on:click={() => (showPassword = !showPassword)}
        >
          {showPassword ? 'hide' : '👀'}
        </button>
      </div>

      <button class="btn btn-secondary w-full" on:click={handleLogin}>
        Login
      </button>

      <p class="text-center text-sm text-gray-600">
        Don't have an account?
        <a href="/register" class="text-secondary font-medium hover:underline">Sign up</a>
      </p>
    </div>
  </div>
</div>
