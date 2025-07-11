<script>
	import '../app.css';
	import { onMount } from 'svelte';

	onMount(() => {
		// Smooth scroll for anchor links
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener('click', (e) => {
				e.preventDefault();
				document.querySelector(anchor.getAttribute('href')).scrollIntoView({
				behavior: 'smooth'
				});
			});
		});
  	});
	let { children } = $props();
</script>
<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 font-sans text-gray-100">
  {@render children()}
</div>

<style>
	*{
		font-family: "Montserrat", sans-serif;
  		font-optical-sizing: auto;
  		font-weight: 400;
  		font-style: normal;
  		font-variation-settings:
    	"wdth" 100;
	}
</style>