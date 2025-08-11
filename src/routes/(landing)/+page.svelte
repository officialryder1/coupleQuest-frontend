<script>
    import { fade } from "svelte/transition"
    import CTASections from "$lib/components/Landing_page/CTASection.svelte"
    import Header from "$lib/components/Landing_page/Header.svelte";
    import HeroSection from "$lib/components/Landing_page/HeroSection.svelte";
    import FeaturesSection from "$lib/components/Landing_page/FeaturesSection.svelte";
    import HowItWorksSection from "$lib/components/Landing_page/HowItWorksSection.svelte";
</script>

<Header />
<HeroSection />
<FeaturesSection />
<HowItWorksSection />
<CTASections />