<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let placeholder = '';

	function handleKeys(e) {
		if (e.key === 'Enter') {
			dispatch('search', {
				query: e.target.value
			});
		}
	}
</script>

<input
	class="rounded-full px-4 py-2 focus:bg-white focus:text-black bg-zinc-800 focus:outline-none focus:ring-0"
	type="text"
	{placeholder}
	on:keyup={handleKeys}
/>
