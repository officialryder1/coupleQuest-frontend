<!-- AchievementBadge.svelte -->
<script>
  export let achievement;
  export let unlocked = false;
</script>

<div class="relative group">
  <div class={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all
    ${unlocked ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-gray-500'}`}>
    {achievement.icon}
  </div>
  
  <div class="absolute hidden group-hover:block bg-gray-800 p-3 rounded-lg shadow-xl z-10 
              w-64 left-1/2 transform -translate-x-1/2 mt-2">
    <h3 class="font-bold text-lg">{achievement.name}</h3>
    <p class="text-sm">{achievement.description}</p>
    <div class="flex justify-between items-center mt-2">
      <span class="text-yellow-400 font-bold">+{achievement.xp_reward} XP</span>
      {#if unlocked}
        <span class="text-green-400 text-xs">Unlocked!</span>
      {:else}
        <span class="text-gray-400 text-xs">Locked 🔒</span>
      {/if}
    </div>
  </div>
</div>