<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { fetchAPI } from '$lib/api';
  import { unsubscribeFromChannel, subscribeToChannel, initPusher } from '$lib/pusher';

  import { goto } from '$app/navigation';

  let code = '';
  let isLoading = false;
  let error = '';
  let success = false;
  let attemptsLeft = 5;
  let isLocked = false;
  let currentUserId = '';
  let user = []

  // Setup Pusher listener
  // function setupPusherListener() {
    
  //   channel.bind('pairing-completed', (data) => {
  //     success = true;
  //   });
    
  //   return () => unsubscribeFromChannel();
  // }


  async function confirmPairing() {
    if (!code || code.length !== 6) {
      error = 'Please enter a 6-digit code';
      return;
    }

    isLoading = true;
    error = '';
    
    try {
      const response = await fetchAPI('couple/pairing/confirm/', 'POST', {
        pairing_code: code
      });
      const coupleID = response.couple.id
      initPusher(currentUserId);

      const channel = subscribeToChannel(coupleId);

      channel.bind('pairing-completed', (data) => {
        playNotificationSound?.();
        isPaired = true;
        goto('/dashboard');
      });
      
      success = true;
      attemptsLeft = 5;
      
      // Redirect after short delay to allow Pusher event to process
      setTimeout(() => goto('/dashboard'), 1000);
    } catch (err) {
      error = err.error || 'Pairing failed';
      attemptsLeft--;
      
      if (attemptsLeft <= 0) {
        isLocked = true;
        setTimeout(() => {
          isLocked = false;
          attemptsLeft = 5;
        }, 3600000);
      }
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    let response = await fetchAPI('user/me')
    user = await response
    currentUserId = user.id
    console.log(currentUserId)

    
    return () => unsubscribeFromChannel(currentUserId);
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-6">
  {#if isLoading}
    <div class="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
  {/if}
  <div class="max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 p-8">
    {#if success}
      <div in:fly={{ y: 20 }} class="text-center space-y-6">
        <div class="text-6xl mb-4">🎉</div>
        <h1 class="text-3xl font-bold text-white">Pairing Successful!</h1>
        <p class="text-blue-200">
          You're now connected with your partner. Start your adventure together!
        </p>
        <a href="/dashboard" class="btn btn-primary">
          Go to Dashboard
        </a>
      </div>
    {:else}
      <h1 class="text-3xl font-bold text-white mb-6">Enter Pairing Code</h1>
      
      {#if error}
        <div class="alert alert-error shadow-lg mb-6">
          <span>{error}</span>
        </div>
      {/if}

      {#if isLocked}
        <div class="alert alert-warning shadow-lg mb-6">
          <span>Too many attempts. Try again in 1 hour.</span>
        </div>
      {:else}
        <div class="space-y-6">
          <div>
            <label class="block text-blue-300 mb-2">6-Digit Code</label>
            <input
              type="text"
              bind:value={code}
              maxlength="6"
              pattern="\d*"
              class="input input-bordered w-full text-2xl text-center font-mono tracking-widest"
              placeholder="123456"
            />
            <p class="text-xs text-blue-400 mt-2">
              {attemptsLeft} attempts remaining
            </p>
          </div>

          <button
            on:click={confirmPairing}
            class="btn btn-primary w-full"
            disabled={isLoading || isLocked}
          >
            {isLoading ? 'Verifying...' : 'Confirm Pairing'}
          </button>

          <div class="alert alert-info shadow-lg">
            <div>
              <span>Get the code from your partner's app</span>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>