<script>
  import { Button } from "$lib/components/ui/button";
  import { Heart, Menu, X } from "@lucide/svelte";

  let isMenuOpen = false;

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Community", href: "/community" },
  ];

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<header class="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
  <div class="container mx-auto px-6">
    <div class="flex items-center justify-between h-20">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Heart class="w-6 h-6 text-pink-500" />
        </div>
        <div class="text-2xl font-bold text-foreground">
          CoupleQuest
        </div>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        {#each navigation as item}
          <a
            href={item.href}
            class="text-foreground hover:text-primary transition-colors font-medium"
          >
            {item.name}
          </a>
        {/each}
      </nav>

      <!-- Desktop CTA -->
      <div class="hidden md:flex items-center gap-4">
        <Button variant="ghost" class="text-foreground hover:text-primary">
          Login
        </Button>
        <Button variant="custom" size="lg">
          Get Started
        </Button>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 text-foreground hover:text-primary transition-colors"
        on:click={toggleMenu}
      >
        {#if isMenuOpen}
          <X class="w-6 h-6" />
        {:else}
          <Menu class="w-6 h-6" />
        {/if}
      </button>
    </div>

    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div class="md:hidden py-6 border-t border-border/50">
        <nav class="flex flex-col gap-4 mb-6">
          {#each navigation as item}
            <a
              href={item.href}
              class="text-foreground hover:text-primary transition-colors font-medium py-2"
              on:click={closeMenu}
            >
              {item.name}
            </a>
          {/each}
        </nav>
        <div class="flex flex-col gap-3">
          <Button variant="ghost" class="text-foreground hover:text-primary">
            Login
          </Button>
          <Button variant="custom">
            Get Started
          </Button>
        </div>
      </div>
    {/if}
  </div>
</header>
