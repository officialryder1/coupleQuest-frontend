<script>
    import Button from "../ui/button/button.svelte";
    import { Heart, Trophy, Star, Zap } from "@lucide/svelte";
</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
    <!-- Animated background elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-20 left-10 animate-pulse">
      <Heart class="w-8 h-8 text-secondary opacity-60" />
    </div>
    <div class="absolute top-32 right-20 animate-bounce">
      <Star class="w-6 h-6 text-accent opacity-70" />
    </div>
    <div class="absolute bottom-32 left-20 animate-pulse">
      <Trophy class="w-10 h-10 text-accent opacity-50" />
    </div>
    <div class="absolute bottom-20 right-10 animate-bounce">
      <Zap class="w-7 h-7 text-secondary opacity-60" />
    </div>
  </div>

  <div class="container mx-auto px-6 relative z-10">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Content -->
      <div class="text-center lg:text-left space-y-8">
        <div class="space-y-4">
          <h1 class="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Level Up Your
            <span class="block text-[#f7b087] bg-clip-text">
              Relationship
            </span>
          </h1>
          <p class="text-xl lg:text-2xl text-white/90 max-w-2xl">
            Turn your love story into an epic adventure. Complete quests together, 
            earn XP, unlock achievements, and climb the couples leaderboard!
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button variant="hero" size="xl" class="group" href="/register">
            Start Your Quest
            <Zap class="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Button>
          <Button variant="gaming" size="xl" class="group" href="/leaderboard">
            View Leaderboard
            <Trophy class="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        <div class="flex items-center justify-center lg:justify-start gap-8 text-white/80">
          <div class="text-center">
            <div class="text-2xl font-bold text-accent">1000+</div>
            <div class="text-sm">Couples Playing</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-accent">50+</div>
            <div class="text-sm">Unique Quests</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-accent">25</div>
            <div class="text-sm">Achievement Levels</div>
          </div>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="relative">
        <div class="relative rounded-3xl overflow-hidden shadow-glow">
          <img
            src="/hero-image.jpg"
            alt="CoupleQuest - Gamified relationship platform"
            class="w-full h-auto object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
        </div>
        
        <!-- Floating XP Badge -->
        <div class="absolute -top-4 -right-4 bg-gradient-card rounded-2xl p-4 shadow-card border border-white/20">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            <span class="text-sm font-semibold text-foreground">+250 XP</span>
          </div>
        </div>

        <!-- Floating Achievement -->
        <div class="absolute -bottom-4 -left-4 bg-gradient-card rounded-2xl p-4 shadow-achievement border border-accent/20">
          <div class="flex items-center gap-2">
            <Trophy class="w-5 h-5 text-accent" />
            <span class="text-sm font-semibold text-foreground">Level 5 Unlocked!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>