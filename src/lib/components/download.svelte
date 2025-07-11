<script>
  import { browser } from '$app/environment';
  let deferredPrompt = null;
  let showInstall = false;

  if (browser) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstall = true;
    });
  }

  async function installApp() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      deferredPrompt = null;
      showInstall = false;
    }
  }
</script>

{#if showInstall}
  <button on:click={installApp} class="btn btn-primary">
    Install CoupleQuest
  </button>
{/if}
