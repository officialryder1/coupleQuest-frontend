<script>
  export let testimonials;
  let activeIndex = 0;

  const next = () => {
    activeIndex = (activeIndex + 1) % testimonials.length;
  };

  const prev = () => {
    activeIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
  };
</script>

<div class="relative">
  <div class="carousel w-full rounded-box">
    {#each testimonials as testimonial, i}
      <div class="carousel-item w-full text-center px-8">
        <div class="max-w-2xl mx-auto">
          <p class="text-2xl italic mb-6">"{testimonial.quote}"</p>
          <p class="font-bold text-lg">— {testimonial.author}</p>
        </div>
      </div>
    {/each}
  </div>
  <div class="flex justify-center gap-4 mt-8">
    <button on:click={prev} class="btn btn-circle">❮</button>
    <button on:click={next} class="btn btn-circle">❯</button>
  </div>
</div>