<script>
    import { onMount } from 'svelte'
      import { fetchAPI } from '$lib/api';

    export let tasks = []

        // Pagination
    let currentPage = 1;
    let totalPages = 1;
    let tasksPerPage = 5;
    let showCompleted = false;
    let countTask = 0
    let completedTask = 0
    let isLoading = false

    async function loadTasks(page = 1, completed = 'undone') {
    isLoading = true;
    try {
      const response = await fetchAPI(
        `task/?page=${page}&page_size=${tasksPerPage}&status=${completed}`
      );
      
      tasks = response.results;
      
      totalPages = Math.ceil(response.count / tasksPerPage);
      currentPage = page;
      showCompleted = completed;
      if (completed == 'undone'){
        countTask = tasks.length
      } else {
        completedTask = tasks.length
      }
      console.log(countTask)
      
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      isLoading = false;
    }
  }

  onMount(async() => {
    await loadTasks();
  })
</script>
      <!-- Tasks Section -->
      <div class="mb-12">
         <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-blue-300">⚔️</span> 
            {showCompleted ? 'Your' : 'Current'} Quests
          </h2>
          <small class="font-extralight tracking-tighter font-mono pl-10"> "There no better love than the love that comes from sharing" - John smite</small>
        <div class="flex justify-center items-center mb-6 mt-6">
         
          <div class="flex gap-4">
            <button 
              class={`btn btn-sm ${!showCompleted ? 'btn-primary' : 'btn-ghost'}`}
              on:click={() => loadTasks(1, 'undone')}
            >

              Current <b class="badge badge-outline badge-dash badge-error">{countTask}</b>
            </button>
            <button 
              class={`btn btn-sm 'btn-primary' ${showCompleted ?  'btn-outline': 'btn-ghost'}`}
              on:click={() => loadTasks(1, 'done')}
            >
            Completed 
            {#if completedTask}
              <b class="badge">{completedTask}</b>
            {/if}
            </button>
          </div>
        </div>

        <!-- Tasks Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {#each tasks as task (task.id)}
            <div class="card bg-slate-800/50 border border-blue-700/30 hover:border-blue-500/50 transition-all">
              <div class="card-body">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-medium text-white">{task.title}</h3>
                  {#if task.is_completed}
                    <span class="badge badge-success">Completed</span>
                  {:else}
                    
                    <button 
                      on:click={() => completeTask(task)}
                      class="btn btn-sm btn-primary"
                    >
                      Complete
                    </button>
                  {/if}
                </div>
                <p class="text-blue-300/80 mt-2">{task.description}</p>
                <div class="mt-3 flex justify-between items-center">
                  <span class="text-sm text-blue-400">
                    {task.points} XP
                  </span>
                  {#if task.due_date}
                    <span class="text-xs text-blue-300/50">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Pagination Controls -->
        {#if totalPages > 1}
          <div class="flex justify-center items-center gap-2 mt-6">
            <button
              class="btn btn-sm"
              disabled={currentPage === 1}
              on:click={() => loadTasks(currentPage - 1, showCompleted)}
            >
              Previous
            </button>
            
            {#each Array(totalPages).fill(0) as _, index}
              <button
                class={`btn btn-sm ${currentPage === index + 1 ? 'btn-active' : ''}`}
                on:click={() => loadTasks(index + 1, showCompleted)}
              >
                {index + 1}
              </button>
            {/each}
            
            <button
              class="btn btn-sm"
              disabled={currentPage === totalPages}
              on:click={() => loadTasks(currentPage + 1, showCompleted)}
            >
              Next
            </button>
          </div>
        {/if}
      </div>