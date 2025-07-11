<script>
    import { fetchAPI } from "$lib/api";

    let email = '';
    let password = '';
    let error = '';

    async function handleLogin() {
      try {
        const data = await fetchAPI('user/login/', 'POST', { email, password });
        localStorage.setItem('access_token', data.access);
        window.location.href = '/dashboard'; // Redirect on success
      } catch (err) {
        error = 'Invalid email or password';
      }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 flex items-center justify-center">
  <div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl font-bold mb-4">CoupleQuest Login</h2>
      {#if error}
        <div class="alert alert-error">{error}</div>
      {/if}
      <input 
        type="email" 
        bind:value={email} 
        placeholder="Email" 
        class="input input-bordered w-full mb-4 text-secondary border-secondary font-bold" 
      />
      <input 
        type="password" 
        bind:value={password} 
        placeholder="Password" 
        class="input input-bordered w-full mb-6 text-secondary border-secondary font-bold" 
      />
      <button on:click={handleLogin} class="btn btn-secondary w-full">
        Login
      </button>

      <div>
        <p class="pt-5 font-bold text-right">Don't have a account? <a href="/register"  class="font-bold text-secondary">signup</a></p>
      </div>
    </div>
  </div>
</div>
