<script>
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card"
    import { Trophy, Zap, Target, Users, Award, Heart} from '@lucide/svelte'

    const features = [
    {
        icon: Target,
        title: "Epic Quests Together",
        description: "Complete romantic challenges, fun activities, and meaningful tasks designed to strengthen your bond.",
        color: "text-purple-500"
    },
    {
        icon: Zap,
        title: "XP & Level System",
        description: "Earn experience points for every quest completed and watch your relationship level grow stronger.",
        color: "text-accent"
    },
    {
        icon: Trophy,
        title: "Couple Leaderboards",
        description: "Compete with other couples and see where your relationship ranks on the global leaderboard.",
        color: "text-pink-400"
    },
    {
        icon: Award,
        title: "Achievement Unlocks",
        description: "Unlock special badges and achievements as you reach relationship milestones together.",
        color: "text-accent"
    },
    {
        icon: Users,
        title: "Community Challenges",
        description: "Join monthly challenges with the CoupleQuest community and share your journey.",
        color: "text-purple-600"
    },
    {
        icon: Heart,
        title: "Love Analytics",
        description: "Track your relationship progress with beautiful insights and celebrate your growth together.",
        color: "text-red-500"
    }
    ];
</script>

<section class="py-24 bg-[#f8f5fe]"  id="features">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Game Features That
        <span class="block text-purple-400 bg-clip-text">
          Bring You Closer
        </span>
      </h2>
      <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
        Every feature is designed to make your relationship stronger, more fun, and more rewarding.
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each features as feature}
        <Card class="group hover:shadow-card transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-border/50">
          <CardHeader class="space-y-4">
            <div class="w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svelte:component this={feature.icon} class={`w-6 h-6 ${feature.color}`} />
            </div>
            <CardTitle class="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-muted-foreground leading-relaxed">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
</section>