<script>
  import CreateTask from '$lib/components/CreateTask.svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-6">
  <div class="max-w-4xl mx-auto">
    <a href="/dashboard" class="btn btn-ghost text-white mb-6">
      ← Back to Dashboard
    </a>
    <CreateTask />
  </div>
</div>