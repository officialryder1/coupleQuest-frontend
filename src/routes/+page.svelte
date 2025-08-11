<script>
  import { fade } from 'svelte/transition';
  import FeatureCard from '$lib/components/FeatureCard.svelte';
  import TestimonialCarousel from '$lib/components/TestimonialCarousel.svelte';
  import AnimatedHeart from '$lib/components/AnimatedHeart.svelte';
  import Download from "$lib/components/Download.svelte"
  


  const screenshots = [
    { id: 1, alt: "Dashboard", src: "/screenshots/dashboard.png" },
    { id: 2, alt: "Tasks", src: "/screenshots/task.png" },
    // { id: 3, alt: "Rewards", src: "/screenshots/dark-rewards.png" }
  ];

  const features = [
    {
      title: "Shared Task Lists",
      description: "Add, edit, and complete tasks together with dual confirmation.",
      icon: "💑"
    },
    {
      title: "XP & Level Ups",
      description: "Earn points, unlock badges, and celebrate milestones.",
      icon: "🏆"
    },
    {
      title: "Daily Streaks",
      description: "Stay connected every day—keep your streak alive!",
      icon: "🔥"
    },
    {
      title: "Custom Rewards",
      description: "Redeem fun rewards like 'Breakfast in Bed' or 'Massage Coupon'.",
      icon: "🎁"
    }
  ];

  const testimonials = [
    {
      quote: "We went from forgetting dates to completing challenges together. 10/10!",
      author: "Alex & Sam"
    },
    {
      quote: "The best part? We laugh more and argue less. Thanks, CoupleQuest!",
      author: "Jamie & Taylor"
    }
  ];
</script>

<!-- ===== HERO SECTION ===== -->
<section class="relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/30 z-0"></div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12">
    <div class="lg:w-1/2" transition:fade>
      <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        <span class="gradient-text">Level Up</span><br>
        Your Love Story
      </h1>
      <p class="text-xl text-gray-300 mb-8">
        Turn everyday moments into adventures. Complete challenges, earn rewards, and grow closer—one quest at a time.
      </p>
      <div class="flex gap-4">
        <a href="/register" class="btn btn-primary btn-lg glow-on-hover">
          Get Started
        </a>
        <a href="/dashboard" class="btn btn-outline btn-secondary btn-lg">
          How It Works →
        </a>
        <Download/>
      </div>
    </div>

    <div class="lg:w-1/2 relative">
      <!-- Floating phone mockup with dark screenshot -->
      <div class="mockup-phone mx-auto floating border-purple-500/30">
        <div class="camera bg-purple-500"></div>
        <div class="display bg-gray-900">
          <img 
            src="/screenshots/dashboard2.png" 
            alt="CoupleQuest App Preview" 
            class="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
      
      <!-- Floating hearts animation -->
      <AnimatedHeart class="absolute -top-10 left-10 text-pink-500/50" />
      <AnimatedHeart class="absolute bottom-20 right-0 text-purple-500/50" delay="1s" />
    </div>
  </div>
</section>

<!-- ===== FEATURES SECTION ===== -->
<section id="features" class="py-20 bg-gray-900/80 backdrop-blur-sm">
  <div class="max-w-7xl mx-auto px-6">
    <h2 class="text-4xl font-bold text-center mb-4 gradient-text">How It Works</h2>
    <p class="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
      CoupleQuest turns relationship goals into a fun, rewarding game.
    </p>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each features as feature, i}
        <FeatureCard 
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          index={i}
        />
      {/each}
    </div>
  </div>
</section>

<!-- ===== SCREENSHOTS CAROUSEL ===== -->
<section id="screenshots" class="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
  <div class="max-w-xl mx-auto px-6">
    <h2 class="text-4xl font-bold text-center mb-12 gradient-text">See It In Action</h2>
    
    <div class="carousel rounded-box shadow-2xl mx-auto border border-purple-500/20">
      {#each screenshots as screenshot, i}
        <div id={`slide${i+1}`} class="carousel-item relative w-full">
          <img 
            src={screenshot.src} 
            class="object-cover" 
            alt={screenshot.alt} 
            loading="lazy"
            
          />
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href={`#slide${i === 0 ? screenshots.length : i}`} class="btn btn-circle bg-gray-900/80 border-purple-500/30">❮</a> 
            <a href={`#slide${i === screenshots.length - 1 ? 1 : i + 2}`} class="btn btn-circle bg-gray-900/80 border-purple-500/30">❯</a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ===== TESTIMONIALS ===== -->
<section class="py-20 bg-gray-900/80">
  <div class="max-w-4xl mx-auto px-6">
    <h2 class="text-4xl font-bold text-center mb-12 gradient-text">Couples Love Us</h2>
    <TestimonialCarousel {testimonials} />
  </div>
</section>

<!-- ===== FINAL CTA ===== -->
<section class="py-20 bg-gradient-to-br from-purple-900 to-pink-900">
  <div class="max-w-4xl mx-auto px-6 text-center">
    <h2 class="text-4xl font-bold mb-6">Ready for Your Adventure?</h2>
    <p class="text-xl mb-8 text-gray-300">Join thousands of couples strengthening their bond—one quest at a time.</p>
    <button class="btn btn-accent btn-lg glow-on-hover">
      Get Started — It's Free!
    </button>
  </div>
</section>

<!-- ===== FOOTER ===== -->
<footer class="footer p-10 bg-gray-900 text-gray-400 border-t border-purple-900/50">
  <div>
    <span class="footer-title text-gray-300">CoupleQuest</span>
    <p>Making relationships fun since 2023 ❤️</p>
  </div>
  <div>
    <span class="footer-title text-gray-300">Legal</span>
    <a class="link link-hover hover:text-purple-400">Privacy Policy</a>
    <a class="link link-hover hover:text-purple-400">Terms of Service</a>
  </div>
  <div>
    <span class="footer-title text-gray-300">Social</span>
    <a class="link link-hover hover:text-pink-400">Instagram</a>
    <a class="link link-hover hover:text-pink-400">TikTok</a>
  </div>
</footer>