<script>
    import { Button } from "$lib/components/ui/button"
    import { Card, CardContent} from "$lib/components/ui/card"
    import { Users, Target, Trophy, Star } from "@lucide/svelte";

    const steps = [
    {
        step: 1,
        icon: Users,
        title: "Create Your Couple Profile",
        description: "Sign up together and create your unique couple avatar. Choose your relationship goals and preferences.",
        color: "bg-[#9b56f0]"
    },
    {
        step: 2,
        icon: Target,
        title: "Start Your First Quest",
        description: "Browse available quests or let our AI suggest the perfect challenges based on your interests.",
        color: "bg-[#f372bd]"
    },
    {
        step: 3,
        icon: Star,
        title: "Complete & Earn XP",
        description: "Work together to complete quests, earn experience points, and unlock new relationship levels.",
        color: "bg-accent"
    },
    {
        step: 4,
        icon: Trophy,
        title: "Climb the Leaderboard",
        description: "See your progress on the global leaderboard and compete with other couples for the top spot!",
        color: "bg-[#9b56f0]"
    }
    ];
</script>

<section class="py-24 bg-[#f5f3fa]">
	<div class="container mx-auto px-6">
		<!-- Header -->
		<div class="text-center mb-16">
			<h2 class="text-4xl lg:text-5xl font-bold text-foreground mb-4">
				How CoupleQuest
				<span class="block text-orange-500 bg-clip-text">
					Works
				</span>
			</h2>
			<p class="text-xl text-muted-foreground max-w-2xl mx-auto">
				Get started in minutes and begin your epic relationship journey together.
			</p>
		</div>

		<!-- Steps -->
		<div class="grid lg:grid-cols-4 gap-8 mb-16">
			{#each steps as step, index}
				<div class="relative">
					<Card class="h-full bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 group">
						<CardContent class="p-8 text-center space-y-6">
							<div class={`w-16 h-16 rounded-2xl ${step.color} mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
								<svelte:component this={step.icon} class="w-8 h-8 text-white" />
							</div>

							<div class="space-y-3">
								<div class="text-sm font-semibold text-muted-foreground">
									STEP {step.step}
								</div>
								<h3 class="text-xl font-semibold text-foreground">
									{step.title}
								</h3>
								<p class="text-muted-foreground leading-relaxed">
									{step.description}
								</p>
							</div>
						</CardContent>
					</Card>

					<!-- Connector Line -->
					{#if index < steps.length - 1}
						<div class="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-primary opacity-30 transform -translate-y-1/2"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- CTA Button -->
		<div class="text-center">
			<Button variant="hero" size="xl" class="group">
				Start Your Adventure Today
				<Star class="w-5 h-5 group-hover:scale-110 transition-transform" />
			</Button>
		</div>
	</div>
</section>