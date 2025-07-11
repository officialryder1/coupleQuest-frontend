<script>
    import { fetchAPI } from "$lib/api";

    let email = '';
    let password = '';
    let username = '';
    let error = '';

    async function handleRegister() {
        try {
        const data = await fetchAPI('user/register/', 'POST', { email, username, password });
        window.location.href = '/login'; // Redirect on success
        } catch (err) {
        error = 'Invalid email or password';
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 flex items-center justify-center">
  <div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl font-bold mb-4">CoupleQuest Register</h2>
      {#if error}
        <div class="alert alert-error">{error}</div>
      {/if}
      <input 
        type="email" 
        bind:value={email} 
        placeholder="Email" 
        class="input input-bordered w-full mb-4 border-secondary text-secondary" 
      />
      <input 
        type="text" 
        bind:value={username} 
        placeholder="username" 
        class="input input-bordered w-full mb-4 border-secondary text-secondary" 
      />
      <input 
        type="password" 
        bind:value={password} 
        placeholder="Password" 
        class="input input-bordered w-full mb-6 border-secondary text-secondary" 
      />
      <button on:click={handleRegister} class="btn btn-secondary w-full">
        Register
      </button>

      <div>
        <p class="p-1 font-bold">Already have an account? <a href="/login" class="text-secondary font-bold">login</a></p>
      </div>
    </div>
  </div>
</div>
