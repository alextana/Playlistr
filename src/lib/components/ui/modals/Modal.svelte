<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { clickOutside } from 'svelte-use-click-outside';

	const dispatch = createEventDispatcher();
	export let open = false;
</script>

{#if open}
	<div
		transition:fade={{ duration: 300 }}
		class="overlay fixed top-0 left-0 z-30 bg-black/40 backdrop-blur-md h-screen w-screen"
	/>
	<div
		transition:fly={{ duration: 300, y: -100 }}
		use:clickOutside={() => dispatch('clickOutside')}
		class="fixed delete-modal p-6 z-40 bg-white shadow-2xl text-neutral-800 rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
	>
		<slot />
	</div>
{/if}
