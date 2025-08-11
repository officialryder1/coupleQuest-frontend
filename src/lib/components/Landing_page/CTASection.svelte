<script>
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Heart, Zap, Trophy } from "@lucide/svelte";
</script>

<section class="py-24 bg-gradient-hero relative overflow-hidden">
  <!-- Background Elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-10 left-10 animate-pulse">
      <Heart class="w-16 h-16 text-white/10" />
    </div>
    <div class="absolute bottom-10 right-10 animate-bounce">
      <Trophy class="w-20 h-20 text-white/10" />
    </div>
    <div class="absolute top-1/2 left-1/4 animate-pulse">
      <Zap class="w-12 h-12 text-white/10" />
    </div>
  </div>

  <div class="container mx-auto px-6 relative z-10">
    <div class="max-w-4xl mx-auto text-center space-y-8">
      <!-- Heading -->
      <div class="space-y-4">
        <h2 class="text-4xl lg:text-6xl font-bold text-white leading-tight">
          Ready to Transform
          <span class="block text-transparent bg-gradient-to-r from-accent to-secondary bg-clip-text">
            Your Love Story?
          </span>
        </h2>
        <p class="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
          Join thousands of couples who are already leveling up their relationships. 
          Start your quest today and see how strong your love can become!
        </p>
      </div>

      <!-- Email signup -->
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
        <div class="space-y-6">
          <h3 class="text-2xl font-semibold text-white">
            Get Early Access
          </h3>
          <div class="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              class="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-accent focus:ring-accent"
            />
            <Button variant="achievement" size="lg" class="sm:px-8">
              Join Waitlist
            </Button>
          </div>
          <p class="text-sm text-white/70">
            Be the first to know when CoupleQuest launches. No spam, just love! 💜
          </p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="hero" size="xl" class="group">
          Start Playing Now
          <Heart class="w-5 h-5 group-hover:scale-110 transition-transform" />
        </Button>
        <Button variant="gaming" size="xl" class="group">
          Learn More
          <Zap class="w-5 h-5 group-hover:scale-110 transition-transform" />
        </Button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-8 max-w-lg mx-auto text-white/80">
        <div class="text-center">
          <div class="text-3xl font-bold text-accent mb-2">Free</div>
          <div class="text-sm">To Start</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-accent mb-2">∞</div>
          <div class="text-sm">Quests Available</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-accent mb-2">24/7</div>
          <div class="text-sm">Support</div>
        </div>
      </div>
    </div>
  </div>
</section>

