<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { fetchAPI } from '$lib/api';
  import { checkPairingStatus } from '$lib/pairing';
	import { goto } from '$app/navigation';
  import { channel, unsubscribeFromChannel, subscribeToChannel, initPusher } from '$lib/pusher';



  let pairingCode = '';
  let isLoading = false;
  let error = '';
  let timeLeft = 900; // 15 minutes in seconds
  let timer;
  let isPaired = false
  let coupleName = ''
  let user = []
  let currentUserId = ''

  // Generate pairing code
  async function generateCode() {
    isLoading = true;
    error = '';
    try {
      const response = await fetchAPI('couple/pairing/initiate/', 'POST', {
        couple_name: coupleName
      });
      pairingCode = response.pairing_code;
      const coupleId =(response.couple_id)
      console.log(response)
      startTimer();
      initPusher(currentUserId)
      subscribeToChannel(coupleId);

      // Listen for pairing completion
      setupPusherListener();

    } catch (err) {
      error = err.message || 'Failed to generate code';
      console.error('Pairing error:', err)
    } finally {
      isLoading = false;
    }
  }
  function playNotificationSound() {
    const audio = new Audio('/sounds/click.wav');
    audio.play().catch(e => console.log('Audio play failed:', e));
  }

   // Setup Pusher listener for pairing completion
  function setupPusherListener() {
    
    channel.bind('pairing-completed', (data) => {
      playNotificationSound();
      // Handle successful pairing
      isPaired = true;
      goto('/dashboard');
    });
    
    return () => unsubscribeFromChannel();
  }
  // Start countdown timer
  function startTimer() {
    clearInterval(timer);
    timeLeft = 900;
    timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        pairingCode = '';
        return;
      }
      timeLeft--;
    }, 1000);
  }

  // Copy to clipboard
  function copyCode() {
    navigator.clipboard.writeText(pairingCode);
  }

  onMount(async () => {
    
    let response = await fetchAPI('user/me')
    user = await response
    currentUserId = user.id
    console.log(currentUserId)

    let status = await checkPairingStatus()
    isPaired = status.is_paired;

    if(isPaired == true){
      goto('/dashboard')
    }
    
    return () =>{
      unsubscribeFromChannel()
      clearInterval(timer);
    }
  });

  
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-6">
  <div class="max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 p-8">
    <h1 class="text-3xl font-bold text-white mb-6">Start Your Couple Journey</h1>

    <div class="form-control">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">
          <span class="label-text mb-2">Couple Name (Optional)</span>
        </label>
        <input 
          type="text" 
          bind:value={coupleName}
          placeholder="e.g. Love Birds" 
          class="input input-bordered mb-5"
          maxlength="100"
        >
      </div>
    
    {#if !pairingCode}
      <div class="space-y-6">
        <p class="text-blue-200">
          Generate a secure code to share with your partner. This code will expire in 15 minutes.
        </p>
        
        {#if error}
          <div class="alert alert-error shadow-lg">
            <span>{error}</span>
          </div>
        {/if}

        <div>
          
          <p class="text-sm tracking-tight"> To confirm partner code <a href="/confirm" class="text-orange-300 font-bold">click here</a></p>
        </div>

        <button 
          on:click={generateCode}
          class="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Pairing Code'}
        </button>
      </div>
    {:else}
      <div transition:fade class="space-y-6">
        <div class="text-center">
          <p class="text-blue-300 mb-2">Share this code with your partner:</p>
          <div class="relative">
            <div class="text-5xl font-mono font-bold text-white tracking-widest mb-2">
              {pairingCode.slice(0, 3)}-{pairingCode.slice(3)}
            </div>
            <button 
              on:click={copyCode}
              class="btn btn-sm btn-ghost absolute -right-2 -top-2"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
          <p class="text-sm text-blue-400">
            Expires in: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </p>
        </div>

        

        <div class="alert alert-info shadow-lg">
          <div>
            <span>⚠️ For security, don't share this code with anyone except your partner.</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button 
            on:click={() => pairingCode = ''}
            class="btn btn-outline btn-error flex-1"
          >
            Cancel
          </button>
          <button 
            on:click={generateCode}
            class="btn btn-outline btn-warning flex-1"
          >
            Generate New Code
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>