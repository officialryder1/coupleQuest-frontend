<script>
  import { page } from '$app/stores';
  
  // Menu items with notification badges
  export const menuItems = [
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard', notify: false },
    { icon: '💬', label: 'Chat', path: '/dashboard/chat', notify: true, count: 0 },
    { icon: '🏡', label: 'Home', path: '/dashboard', notify: false },
    { icon: '📝', label: 'Tasks', path: '/dashboard/tasks', notify: true },
    { icon: '👤', label: 'Profile', path: '/', notify: false }
  ];
  
  $: currentPath = $page.url.pathname;
</script>

<footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-bottom">
  <nav class="flex justify-around">
    {#each menuItems as item}
      <a
        href={item.path}
        class="relative flex flex-col items-center py-3 px-4 text-center transition-colors
               {currentPath === item.path ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}"
        class:active={currentPath === item.path}
      >
        {#if item.notify && item.count}
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {item.count}
          </span>
        {:else if item.notify}
          <span class="absolute top-0 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
        {/if}
        
        <span class="text-2xl">{item.icon}</span>
        <span class="text-xs mt-1">{item.label}</span>
      </a>
    {/each}
  </nav>
</footer>

<style>
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .active {
    animation: bounce 0.5s;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
</style>