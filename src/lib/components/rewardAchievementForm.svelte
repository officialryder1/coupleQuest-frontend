<script>
  import { onMount } from 'svelte';
  import { fetchAPI } from '$lib/api';

  let achievements = [];
  let couples = [];
  let selectedAchievement = '';
  let selectedCouple = '';
  let isLoading = false;
  let error = '';
  let success = false;

  onMount(async () => {
    try {
      const [achRes, coupleRes] = await Promise.all([
        fetchAPI('reward/'),
        fetchAPI('couple/')
      ]);
      achievements = achRes;
      couples = coupleRes;
    } catch (err) {
      error = err.message;
    }
  });

  async function handleSubmit() {
    if (!selectedAchievement || !selectedCouple) {
      error = 'Please select both an achievement and a couple';
      return;
    }

    isLoading = true;
    error = '';
    success = false;

    try {
      const response = await fetchAPI('reward/achievements/reward/', 'POST', {
        achievement_id: selectedAchievement,
        couple_id: selectedCouple
      });

      success = true;
      setTimeout(() => success = false, 3000);
    } catch (err) {
      error = err.error || err.message || 'Failed to reward achievement';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-6 bg-white/5 rounded-lg border border-white/10">
  <h2 class="text-2xl font-bold text-white mb-6">Reward Achievement</h2>

  {#if error}
    <div class="alert alert-error mb-4">
      <span>{error}</span>
    </div>
  {/if}

  {#if success}
    <div class="alert alert-success mb-4">
      <span>Achievement rewarded successfully!</span>
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text text-white">Select Couple</span>
      </label>
      <select 
        bind:value={selectedCouple}
        class="select select-bordered w-full"
        disabled={isLoading}
      >
        <option value="" disabled selected>Choose couple</option>
        {#each couples as couple}
          <option value={couple.id}>
            {couple.user1} & {couple.user2}
          </option>
        {/each}
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text text-white">Select Achievement</span>
      </label>
      <select 
        bind:value={selectedAchievement}
        class="select select-bordered w-full"
        disabled={isLoading}
      >
        <option value="" disabled selected>Choose achievement</option>
        {#each achievements as ach}
          <option value={ach.id}>
            {ach.icon} {ach.name} (+{ach.xp_reward} XP each)
          </option>
        {/each}
      </select>
    </div>

    <button 
      type="submit" 
      class="btn btn-primary w-full"
      disabled={isLoading || !selectedAchievement || !selectedCouple}
    >
      {isLoading ? 'Rewarding...' : 'Reward Achievement'}
    </button>
  </form>
</div>