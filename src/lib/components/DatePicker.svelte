<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { format } from 'date-fns';
  
  export let date = null;
  export let placeholder = 'Select a date';
  export let minDate = null;
  export let maxDate = null;
  
  let isOpen = false;
  let currentMonth = new Date();
  let days = [];
  let calendarRef;
  
  // Client-side only code
  let isBrowser = false;
  
  onMount(() => {
    isBrowser = typeof window !== 'undefined';
    generateCalendar();
    if (isBrowser) {
      document.addEventListener('click', handleClickOutside);
    }
  });
  
  afterUpdate(() => {
    if (isOpen && isBrowser) {
      // Position the calendar popup if needed
      positionCalendar();
    }
  });
  
  onDestroy(() => {
    if (isBrowser) {
      document.removeEventListener('click', handleClickOutside);
    }
  });
  
  function positionCalendar() {
    if (!calendarRef || !isBrowser) return;
    
    const popup = calendarRef.querySelector('.calendar-popup');
    if (!popup) return;
    
    const rect = calendarRef.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    
    if (spaceBelow < 300 && rect.top > 300) {
      // Not enough space below, position above
      popup.style.bottom = '100%';
      popup.style.top = 'auto';
    } else {
      // Default position below
      popup.style.top = '100%';
      popup.style.bottom = 'auto';
    }
  }
  
  // Rest of your existing functions (generateCalendar, isDateDisabled, etc.)
  function generateCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const prevLastDay = new Date(year, month, 0).getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();
    
    const daysInMonth = lastDay.getDate();
    
    let daysArray = [];
    
    // Previous month days
    for (let i = firstDayIndex; i > 0; i--) {
      daysArray.push({
        date: new Date(year, month - 1, prevLastDay - i + 1),
        isCurrentMonth: false,
        isDisabled: isDateDisabled(new Date(year, month - 1, prevLastDay - i + 1))
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      daysArray.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: isToday(dayDate),
        isSelected: date && isSameDay(dayDate, date),
        isDisabled: isDateDisabled(dayDate)
      });
    }
    
    // Next month days
    for (let i = 1; i <= 6 - lastDayIndex; i++) {
      daysArray.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isDisabled: isDateDisabled(new Date(year, month + 1, i))
      });
    }
    
    days = daysArray;
  }
  
  function isDateDisabled(d) {
    return (minDate && d < minDate) || (maxDate && d > maxDate);
  }
  
  function isToday(d) {
    return isSameDay(d, new Date());
  }
  
  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getDate() === d2.getDate();
  }
  
  function selectDay(day) {
    if (day.isDisabled || !isBrowser) return;
    date = day.date;
    isOpen = false;
    generateCalendar();
  }
  
  function changeMonth(offset) {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + offset,
      1
    );
    generateCalendar();
  }
  
  function handleClickOutside(event) {
    if (calendarRef && !calendarRef.contains(event.target)) {
      isOpen = false;
    }
  }
</script>

{#if isBrowser}
  <div class="datepicker relative" bind:this={calendarRef}>
    <div class="input-group">
      <input
        type="text"
        readonly
        class="input input-bordered w-full cursor-pointer"
        value={date ? format(date, 'MMM d, yyyy') : ''}
        placeholder={placeholder}
        on:click={() => isOpen = !isOpen}
      />
      <button
        class="btn btn-square btn-ghost absolute right-0"
        on:click|stopPropagation={() => { date = null; generateCalendar(); }}
        disabled={!date}
      >
        ✕
      </button>
    </div>
    
    {#if isOpen}
      <div class="calendar-popup absolute z-10 mt-2 bg-base-100 rounded-lg shadow-lg border border-base-300 p-4 w-64">
        <div class="calendar-header flex justify-between items-center mb-4">
          <button 
            class="btn btn-sm btn-circle btn-ghost"
            on:click|preventDefault={() => changeMonth(-1)}
          >
            &lt;
          </button>
          <h3 class="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button 
            class="btn btn-sm btn-circle btn-ghost"
            on:click|preventDefault={() => changeMonth(1)}
          >
            &gt;
          </button>
        </div>
        
        <div class="calendar-grid">
          <div class="grid grid-cols-7 gap-1 mb-2">
            {#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as day}
              <div class="text-center text-sm font-medium text-gray-500">{day}</div>
            {/each}
          </div>
          
          <div class="grid grid-cols-7 gap-1">
            {#each days as day, i}
              <button
                class={`btn btn-sm btn-circle
                  ${day.isCurrentMonth ? '' : 'text-gray-400'}
                  ${day.isToday ? 'btn-accent' : ''}
                  ${day.isSelected ? 'btn-primary' : ''}
                  ${day.isDisabled ? 'btn-disabled' : 'hover:btn-secondary'}
                `}
                on:click|preventDefault={() => selectDay(day)}
                disabled={day.isDisabled}
              >
                {day.date.getDate()}
              </button>
            {/each}
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            class="btn btn-sm btn-ghost"
            on:click|preventDefault={() => { date = new Date(); isOpen = false; generateCalendar(); }}
          >
            Today
          </button>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <!-- SSR fallback -->
  <div class="datepicker">
    <input
      type="text"
      readonly
      class="input input-bordered w-full"
      value={date ? format(date, 'MMM d, yyyy') : ''}
      placeholder={placeholder}
    />
  </div>
{/if}

<style>
  .datepicker {
    width: 100%;
  }
  
  .calendar-popup {
    animation: fadeIn 0.2s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>