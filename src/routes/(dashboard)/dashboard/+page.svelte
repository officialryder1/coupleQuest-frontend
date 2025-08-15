<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import confetti from 'canvas-confetti';
  import { fetchAPI } from '$lib/api';
  import { checkPairingStatus } from '$lib/pairing';
  import Achievements from '$lib/components/Achievements.svelte';
  import { couplePusher, disconnectPusher } from '$lib/pusher';
  
  
  // Game state
  let tasks = [];
  let stats = { xp: 0, level: 1, streak: 0 };
  let rewards = [];
  let showLevelUp = false;
  let moonPhase = Math.floor(Math.random() * 8); // 0-7
  let coupleInfo = null;
  let isLoading = true;
  let unlockedAchievements = []
  let lockedAchievements = []
  let showAchievement = null
  let websocket = null
  let user = []

  // Pagination
  let currentPage = 1;
  let totalPages = 1;
  let tasksPerPage = 5;
  let showCompleted = false;
  let countTask = 0
  let completedTask = 0

  // Sound effects
  const playSound = (effect) => {
    if (typeof window !== 'undefined') {
      new Audio(`/sounds/${effect}.wav`).play().catch(e => console.log("Audio prevented:", e));
    }
  };

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
  
  // Load data
  onMount(async () => {
    await loadTasks();

    try {
      // First check pairing status
      const status = await checkPairingStatus();
      
      if (status.is_paired && status.couple_id) {
        // Load all data in parallel
        const [tasksRes, statsRes, rewardsRes, coupleRes, achievementRes, userRes] = await Promise.all([
          fetchAPI('task/'),
          fetchAPI('user/stats/'),
          fetchAPI('reward/'),
          fetchAPI(`couple/${status.couple_id}`),
          fetchAPI('reward/achievements/'),
          fetchAPI('user/me')
        ]);
        
        tasks = tasksRes;
        stats = statsRes;
        rewards = rewardsRes;
        coupleInfo = coupleRes;
        user = await userRes
        unlockedAchievements = achievementRes.unlocked;
        lockedAchievements = achievementRes.locked;
      } else {
        // Load only user-specific data if not paired
        const [tasksRes, statsRes, rewardsRes, userRes] = await Promise.all([
          fetchAPI('task/'),
          fetchAPI('user/stats/'),
          fetchAPI('reward/'),
          fetchAPI('user/me')
        ]);
        
        tasks = tasksRes;
        stats = statsRes;
        rewards = rewardsRes;
        user = await userRes
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      console.error("Failed to load achievements:", error);
    } finally {
      isLoading = false;
    }
    couplePusher(user.id, coupleInfo.id, {
      taskUpdate: handleTaskUpdate,
      taskCreated: handleTaskCreated,
      taskDeleted: handleTaskDeleted,
      achievementUnlocked: handleAchievementUnlock,
      streakUpdated: handleStreakUpdate
    });
    
  });

  onDestroy(() => disconnectPusher())
  

  function handleTaskCreated(payload) {
    console.log('🔄 Task created payload:', payload);
    
    // If you're doing: pusher.trigger('...', 'task_created', { task: TaskSerializer(task).data })
    const newTask = payload?.task
    
    if (!newTask) {
      console.warn('⚠️ Received invalid task_created payload:', data);
      return;
    }


    if (showCompleted === 'undone') {
      tasks = [newTask, ...tasks];
      countTask++;
      playSound('click');
    }

    alert(`${newTask.title} was added by your partner.`);
  }

  function handleTaskDeleted(deletedTask) {
    tasks = tasks.filter(task => task.id !== deletedTask.id);
    countTask = tasks.length;
  }

  function handleTaskUpdate(updatedTask) {
    tasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    
    if (updatedTask.is_completed) {
      playSound('task-complete');
    }
  }

  function handleAchievementUnlock(achievement) {
    unlockedAchievements = [...unlockedAchievements, achievement];
    showAchievement = achievement;
    playSound('achievement-unlocked');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  function handleStreakUpdate(newStreak) {
    stats.streak = newStreak;
  }

  // Complete task with celebration
  async function completeTask(task) {
    if (task.is_completed) return;

    try {
      playSound('task-complete');
      const oldLevel = stats.level;
      await fetchAPI(`task/${task.id}/complete/`, 'PATCH', { is_completed: true });

      // Reload current page after completion
      await loadTasks(currentPage, showCompleted);

      // Check for new achievements after completion
      const newAchievements = await checkForNewAchievements();

      stats = await fetchAPI('user/stats/');
      
      if (stats.level > oldLevel) {
        showLevelUp = true;
        playSound('level-up');
        setTimeout(() => showLevelUp = false, 3000);
      }
      
      if (newAchievements.length > 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899']
        });
      } else {
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.6 }
        });
      }

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899']
      });
    } catch(error) {
      console.error("Failed to complete task:", error);
    }
  }

  async function checkForNewAchievements() {
    const newAchievements = await fetchAPI('reward/achievements/check/');
    if (newAchievements.length > 0) {
      unlockedAchievements = [...unlockedAchievements, ...newAchievements];
      showAchievement = newAchievements[0];
      return newAchievements;
    }
    return [];
  }
</script>

<!-- Deep cosmic blue background with parallax layers -->
<div class="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 p-6 overflow-hidden relative">
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center z-50">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else}
    <!-- Parallax starfield -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      {#each Array(60) as _, i}
        <div 
          class="absolute rounded-full bg-blue-500/10 animate-pulse"
          style={`
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            animation-delay: ${i * 0.5}s;
            opacity: ${Math.random() * 0.5 + 0.1};
          `}
        ></div>
      {/each}
    </div>

    <!-- Floating constellations -->
    <div class="absolute inset-0 pointer-events-none opacity-30">
      {#each Array(8) as _, i}
        <svg 
          class="absolute text-blue-400"
          style={`
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 100 + 50}px;
            transform: rotate(${Math.random() * 360}deg);
          `}
          viewBox="0 0 100 100"
        >
          <path 
            d="M10,50 L90,50 M50,10 L50,90 M25,25 L75,75 M25,75 L75,25" 
            stroke="currentColor" 
            stroke-width="0.8"
          />
        </svg>
      {/each}
    </div>

    <!-- Main container -->
    <div class="relative max-w-6xl mx-auto z-10">
      <!-- Level Up Modal -->
      {#if showLevelUp}
        <div 
          transition:fade
          class="absolute inset-0 z-50 flex items-center justify-center"
        >
          <div 
            in:fly={{ y: -50 }}
            class="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-2xl text-center border-2 border-blue-400/50 relative overflow-hidden"
          >
            <!-- Animated rings -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="absolute w-40 h-40 border-2 border-blue-400/30 rounded-full animate-ping"></div>
              <div class="absolute w-56 h-56 border-2 border-blue-400/20 rounded-full animate-ping" style="animation-delay: 0.3s"></div>
            </div>
            
            <div class="relative z-10">
              <div class="text-6xl mb-4 animate-bounce">🌠</div>
              <h2 class="text-3xl font-bold text-white mb-2">LEVEL UP!</h2>
              <p class="text-xl text-blue-100">Now at Level {stats.level}</p>
              <button 
                on:click={() => showLevelUp = false}
                class="btn btn-sm btn-outline btn-info mt-4"
              >
                Continue Adventure
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Header with 3D moon phase -->
      <header class="flex justify-between items-center mb-12">
        <div class="flex items-center gap-4">
          <div class="relative">
            <!-- 3D Avatar Placeholder -->
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl text-white shadow-lg border-2 border-blue-400/50 transform hover:rotate-6 transition-transform">
              👩❤️👨
            </div>
            <div class="absolute -bottom-2 -right-2 bg-blue-600 text-xs font-bold rounded-full px-2 py-1 shadow border border-blue-400/30">
              Lv. {stats.level}
            </div>
          </div>
          <div>
            <!-- <h1 class="text-2xl font-bold text-white">CoupleQuest</h1> -->
            <p class="text-blue-300/80 text-sm">Journey through love</p>
            {#if user}
              <big>{user.username}</big>
            {/if}
          </div>
        </div>
        
        <!-- Moon Phase Widget -->
        <div 
          class="tooltip tooltip-bottom" 
          data-tip={['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'][moonPhase]}
        >
          <div class="w-12 h-12 rounded-full bg-slate-800 border border-blue-700/50 flex items-center justify-center shadow-lg">
            <div class="text-2xl">
              {['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][moonPhase]}
            </div>
          </div>
        </div>
      </header>

      <!-- Stats Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <!-- XP Card -->
        <div class="card bg-blue-900/20 backdrop-blur-sm border border-blue-700/30 hover:border-blue-500/50 transition-all hover:scale-[1.02] group">
          <div class="card-body">
            <div class="flex items-center gap-4">
              <div class="text-3xl text-blue-300 transform group-hover:scale-110 transition-transform">✨</div>
              <div>
                <h3 class="text-blue-300/80 text-sm uppercase tracking-wider">Experience</h3>
                <p class="text-xl font-bold text-white">{stats.xp} <span class="text-blue-300/70 text-sm">XP</span></p>
                <progress 
                  class="progress progress-info w-full mt-2 bg-blue-900/30 h-2" 
                  value={stats.xp} 
                  max={stats.level * 100}
                ></progress>
                <p class="text-xs text-blue-300/50 mt-1">{stats.level * 100 - stats.xp} XP to next level</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Couple Stats Card (only show if paired) -->
        {#if coupleInfo}
          <div class="card bg-blue-900/20 backdrop-blur-sm border border-blue-700/30 hover:border-blue-500/50 transition-all hover:scale-[1.02] group">
            <div class="card-body">
              <h3 class="text-purple-200 text-sm uppercase tracking-wider">Couple</h3>
              <h2 class="text-xl font-bold text-white">{coupleInfo.name}</h2>
              <p class="text-sm text-purple-300">
                {coupleInfo.user1_name} & {coupleInfo.user2_name}
              </p>
              <div class="mt-2">
                <div class="stat p-0">
                  <div class="stat-title">Couple Streak</div>
                  <div class="stat-desc text-lg">{coupleInfo.current_streak} days</div>
                  <div class="stat-value text-sm">Combined {coupleInfo.combined_points} pts</div>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- Streak Card -->
        <div class="card bg-blue-800/20 backdrop-blur-sm border border-blue-600/30 hover:border-blue-400/50 transition-all hover:scale-[1.02] group">
          <div class="card-body">
            <div class="flex items-center gap-4">
              <div class="text-3xl text-orange-300 animate-pulse transform group-hover:scale-110 transition-transform">🔥</div>
              <div>
                <h3 class="text-blue-300/80 text-sm uppercase tracking-wider">Streak</h3>
                <p class="text-xl font-bold text-white">{stats.streak} <span class="text-blue-300/70 text-sm">days</span></p>
                <p class="text-xs text-blue-300/50 mt-1">
                  {stats.streak >= 7 ? 'Legendary streak!' : 
                  stats.streak >= 3 ? 'Keep it going!' : 'Start a streak!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Section -->
      <div class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-blue-300">⚔️</span> 
            {showCompleted ? 'Your' : 'Current'} Quests
          </h2>
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

      <!-- Achievements Gallery -->
      <div class="mb-12">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span class="text-yellow-300">🏆</span> Achievements
        </h2>
        
        <Achievements 
          {unlockedAchievements} 
          {lockedAchievements} 
          bind:showAchievement
        />
        
        <div class="mt-4 text-center text-sm text-blue-300/70">
          {unlockedAchievements.length} of {unlockedAchievements.length + lockedAchievements.length} unlocked
        </div>
      </div>

      <!-- Sound Toggle -->
      <div class="fixed bottom-4 right-4">
        <button 
          on:click={() => playSound('click')}
          class="btn btn-circle btn-sm btn-info glass"
          title="Toggle sound effects"
        >
          🔈
        </button>
      </div>
    </div>
  {/if}
</div>

<style global>
  /* Enhanced glow effect */
  .glow-blue {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
    animation: pulse-blue 3s infinite ease-in-out;
  }
  
  @keyframes pulse-blue {
    0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); transform: translateY(0); }
    50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.6); transform: translateY(-3px); }
    100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); transform: translateY(0); }
  }

  /* Glass effect */
  .glass {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
</style>