<script>
  import { checkPairingStatus } from '../pairing';
  import { onMount } from 'svelte';

  let isPaired = false;
  export let showTitle = true
  let page = 'pairing'

  onMount(async () => {
    const status = await checkPairingStatus();
    isPaired = status.is_paired;
    if(window.location.pathname == '/pairing'){
      page = 'confirm' 
    }

  });

</script>

<nav class="bg-blue-900/50 backdrop-blur border-b border-blue-800">
  <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
    <a href="/" class="text-xl font-bold text-white flex items-center gap-2">
      <span class="text-blue-300">Couple</span>Quest
    </a>

    <div class="flex items-center gap-4">
      {#if isPaired}
        <a href="/dashboard" class="btn btn-sm btn-ghost text-white">
          {#if showTitle}
            Dashboard
          {/if}
        </a>
        <a href="/dashboard/create" class="btn btn-primary">
        + Create New Task
        </a>
      {:else}
        <a href="/{page}" class="btn btn-sm btn-primary">
          Start Pairing
        </a>
      {/if}
    </div>
  </div>
</nav>