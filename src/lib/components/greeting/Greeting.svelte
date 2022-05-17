<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let greeting = null;

	let today = new Date();
	let curHr = today.getHours();

	onMount(() => {
		if (curHr < 12) {
			greeting = 'morning';
		} else if (curHr < 18) {
			greeting = 'afternoon';
		} else {
			greeting = 'evening';
		}
	});
</script>

{#if greeting}
	<h1 in:fade={{ duration: 300 }} class="text-4xl font-extrabold mb-8">
		<span class="font-light">Good</span>
		{greeting}
	</h1>
{/if}
