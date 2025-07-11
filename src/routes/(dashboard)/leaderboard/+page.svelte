<script>
  import { onMount } from 'svelte';
  import { fetchAPI } from '$lib/api';

  let couples = [];
  let isLoading = true;

  onMount(async () => {
    const data = await fetchAPI('couple/leaderboard/');
    couples = data;
    isLoading = false;
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-indigo-900 mb-3">Couples Leaderboard</h1>
      <p class="text-lg text-indigo-700">Celebrating the most connected pairs in our community</p>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    {:else}
      <!-- Leaderboard Cards -->
      <div class="space-y-4">
        {#each couples as couple, i}
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="p-6 flex items-center">
              <!-- Rank Badge -->
              <div class="flex-shrink-0 mr-6">
                {#if i === 0}
                  <div class="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-md">
                    <span class="text-2xl font-bold text-white">#{i + 1}</span>
                  </div>
                {:else if i === 1}
                  <div class="w-16 h-16 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center shadow-md">
                    <span class="text-2xl font-bold text-white">#{i + 1}</span>
                  </div>
                {:else if i === 2}
                  <div class="w-16 h-16 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center shadow-md">
                    <span class="text-2xl font-bold text-white">#{i + 1}</span>
                  </div>
                {:else}
                  <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shadow-md">
                    <span class="text-2xl font-bold text-indigo-800">#{i + 1}</span>
                  </div>
                {/if}
              </div>
              
              <!-- Couple Info -->
              <div class="flex-grow">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900">{couple.name}</h3>
                    <p class="text-indigo-600">
                      {couple.user1_name}
                      {#if couple.user2_name}
                        <span class="text-gray-500 mx-1">&</span> {couple.user2_name}
                      {/if}
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm text-gray-500">Total Points</div>
                    <div class="text-2xl font-bold text-indigo-700">{couple.combined_points.toLocaleString()}</div>
                  </div>
                </div>
                
                <!-- Progress bar (optional) -->
                {#if i === 0}
                  <div class="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-yellow-500 h-2.5 rounded-full" style="width: 100%"></div>
                  </div>
                {:else}
                  <div class="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-indigo-500 h-2.5 rounded-full" style={`width: ${Math.round((couple.combined_points / couples[0].combined_points) * 100)}%`}></div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Footer Note -->
    <div class="mt-12 text-center text-sm text-gray-500">
      <p>Leaderboard updates every hour. Last updated: {new Date().toLocaleTimeString()}</p>
    </div>
  </div>
</div>