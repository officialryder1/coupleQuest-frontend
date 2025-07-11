<script>
  export let title;
  export let description;
  export let icon;
  export let index;
</script>

<div 
  class="card bg-gray-800 border border-purple-900/30 hover:border-pink-500/50 transition-all hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20"
  in:fly={{ y: 50, delay: index * 100 }}
>
  <div class="card-body items-center text-center p-8">
    <div class="text-5xl mb-4">{icon}</div>
    <h3 class="card-title text-2xl font-bold text-gray-100">{title}</h3>
    <p class="text-gray-400">{description}</p>
  </div>
</div>