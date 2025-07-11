<script>
	import '../../app.css';
	import { onMount } from 'svelte';
	import { requirePairedUser } from '$lib/pairing';
	import Nav from '$lib/components/nav.svelte';
	import FooterNav from '$lib/components/footerNav.svelte';

	onMount(async () => {
		// Protect all routes except pairing pages
		const allowedPaths = ['/pairing', '/confirm', '/login', 'register'];
		const currentPath = window.location.pathname;
		
		if (!allowedPaths.some(path => currentPath.startsWith(path))) {
			await requirePairedUser();
		}

        if(window.location.pathname == '/dashboard'){
            showTitle = false
        }
	})

	let { children, showTitle } = $props();

    

</script>
<Nav {showTitle}/>
{@render children()}
<div class="m-10">
    <FooterNav/>
</div>

