<script>
  import { fetchAPI } from '$lib/api';
  import DatePicker from './datePicker.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { couplePusher } from '$lib/pusher';
  
  let title = '';
  let description = '';
  let difficulty = 'MEDIUM';
  let category = 'OTHER';
  let assignedTo = null;
  let dueDate = null;
  let isRecurring = false;
  let recurrencePattern = '';
  let partner = null;
  let isLoading = false;
  let error = '';
  let user = []
  
  // Get partner info when component mounts
  onMount(async () => {
    const coupleInfo = await fetchAPI('couple/pairing/status/');
    const response = await fetchAPI('user/me')
    user = await response
    
    if (coupleInfo.is_paired) {
      partner = coupleInfo.user1 === user.id ? coupleInfo.user2 : coupleInfo.user1;
    }
  });
  

  const difficulties = [
    { value: 'EASY', label: 'Easy (10 XP)' },
    { value: 'MEDIUM', label: 'Medium (20 XP)' },
    { value: 'HARD', label: 'Hard (30 XP)' }
  ];
  
  const categories = [
    { value: 'ROMANCE', label: 'Romance', icon: '💖' },
    { value: 'CHORES', label: 'Chores', icon: '🧹' },
    { value: 'FITNESS', label: 'Fitness', icon: '💪' },
    { value: 'ADVENTURE', label: 'Adventure', icon: '🌍' },
    { value: 'OTHER', label: 'Other', icon: '📝' }
  ];
  
  const recurrenceOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  function taskDifficulty(task){
    let score = 0
    if(task == 'HARD'){
      score = 30
    } else if(task == 'MEDIUM') {
      score = 20
    } else {
      score = 10
    }

    return score
  }
  
  async function handleSubmit() {
    if (!title.trim()) {
      error = 'Title is required';
      return;
    }
    
    isLoading = true;
    error = '';
    
    try {
      const response = await fetchAPI('task/create/', 'POST', {
        title,
        description,
        points: taskDifficulty(difficulty),
        category,
        assigned_to: assignedTo,
        due_date: dueDate?.toISOString().split('T')[0],
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? recurrencePattern : ''
      });
      
      // Reset form
      title = '';
      description = '';
      difficulty = 'MEDIUM';
      category = 'OTHER';
      assignedTo = null;
      dueDate = null;
      isRecurring = false;
      recurrencePattern = '';
      
      // Show success and redirect
      alert('Task created successfully!');
      goto('/dashboard');
    } catch (err) {
      error = err.error || err.message || 'Failed to create task';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
  <h2 class="text-2xl font-bold text-white mb-6">Create New Task</h2>
  
  {#if error}
    <div class="alert alert-error mb-4">
      <span>{error}</span>
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <!-- Title & Description -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control col-span-2">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">
          <span class="label-text text-white">Title*</span>
        </label>
        <input 
          type="text" 
          bind:value={title}
          class="input input-bordered w-full"
          placeholder="Task title"
          required
        />
      </div>
      
      <div class="form-control col-span-2">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">
          <span class="label-text text-white">Description</span>
        </label>
        <textarea 
          bind:value={description}
          class="textarea textarea-bordered w-full"
          placeholder="Optional description"
          rows="3"
        ></textarea>
      </div>
    </div>
    
    <!-- Difficulty & Category -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">
          <span class="label-text text-white">Difficulty</span>
        </label>
        <select bind:value={difficulty} class="select select-bordered w-full">
          {#each difficulties as d}
            <option value={d.value}>{d.label}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-control">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">
          <span class="label-text text-white">Category</span>
        </label>
        <select bind:value={category} class="select select-bordered w-full">
          {#each categories as c}
            <option value={c.value}>
              {c.icon} {c.label}
            </option>
          {/each}
        </select>
      </div>
    </div>
    
    <!-- Assignment & Due Date -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#if partner}
        <div class="form-control">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="label">
            <span class="label-text text-white">Assign to Partner</span>
          </label>
          <label class="label cursor-pointer justify-start gap-2">
            <input 
              type="checkbox" 
              bind:checked={assignedTo}
              class="checkbox checkbox-primary" 
              on:change={() => assignedTo = assignedTo ? null : partner.id}
            />
            <span class="label-text">Assign to {partner.username}</span>
          </label>
        </div>
      {/if}
      
      <div class="form-control">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">
          <span class="label-text text-white">Due Date</span>
        </label>
        <DatePicker bind:date={dueDate} />
      </div>
    </div>
    
    <!-- Recurring Task -->
    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-2">
        <input 
          type="checkbox" 
          bind:checked={isRecurring}
          class="checkbox checkbox-primary" 
        />
        <span class="label-text text-white">Recurring Task</span>
      </label>
      
      {#if isRecurring}
        <div class="mt-2">
          <select 
            bind:value={recurrencePattern}
            class="select select-bordered w-full"
            required
          >
            <option value="" disabled selected>Select recurrence</option>
            {#each recurrenceOptions as r}
              <option value={r.value}>{r.label}</option>
            {/each}
          </select>
        </div>
      {/if}
    </div>
    
    <!-- Submit Button -->
    <button 
      type="submit" 
      class="btn btn-primary w-full mt-6"
      disabled={isLoading}
    >
      {isLoading ? 'Creating...' : 'Create Task'}
      {#if isLoading}<span class="loading loading-spinner ml-2"></span>{/if}
    </button>
  </form>
</div>