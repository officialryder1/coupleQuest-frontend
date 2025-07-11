<script>
  import { fly, fade } from 'svelte/transition';
  import { fetchAPI } from '$lib/api';
  
  export let unlockedAchievements = [];
  export let lockedAchievements = [];
  let showAchievement = null;
  
  // Play sound when new achievement pops
  $: if (showAchievement) {
    new Audio('/sounds/task-complete.wav').play().catch(console.error);
    setTimeout(() => showAchievement = null, 5000);
  }
  
  // Function to check for new achievements (called after task completion)
  async function checkForNewAchievements() {
    const newAchievements = await fetchAPI('achievements/check/');
    if (newAchievements.length > 0) {
      unlockedAchievements = [...unlockedAchievements, ...newAchievements];
      showAchievement = newAchievements[0];
      return newAchievements;
    }
    return [];
  }
</script>

<!-- Achievement Toast Notification -->
{#if showAchievement}
  <div 
    transition:fly={{ y: 50 }}
    class="fixed top-4 right-4 z-50"
  >
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 shadow-xl border border-white/10">
      <div class="flex items-center gap-3">
        <span class="text-3xl animate-bounce">{showAchievement.icon}</span>
        <div>
          <h3 class="font-bold text-white">Achievement Unlocked!</h3>
          <p class="text-sm text-white/90">{showAchievement.name}</p>
          <p class="text-xs text-purple-200 mt-1">+{showAchievement.xp_reward} XP</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Achievements Grid -->
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {#each unlockedAchievements as ach}
    <div 
      class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 rounded-lg border border-blue-400/30 
             hover:scale-105 transition-transform cursor-pointer relative group"
      on:click={() => showAchievement = ach}
    >
      <div class="text-3xl text-center mb-2">{ach.icon}</div>
      <h4 class="text-center font-medium text-sm text-white">{ach.name}</h4>
      <div class="absolute inset-0 bg-blue-500/5 rounded-lg pointer-events-none 
                  opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  {/each}
  
  {#each lockedAchievements as ach}
    <div class="bg-slate-800/20 p-4 rounded-lg border border-slate-700/30 relative">
      <div class="text-3xl text-center mb-2 text-slate-500">🔒</div>
      <h4 class="text-center font-medium text-sm text-slate-400">{ach.name}</h4>
      <div class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
        <span class="text-xs bg-slate-900/80 px-2 py-1 rounded">Locked</span>
      </div>
    </div>
  {/each}
</div>