<script>
	export let label = '';
	export let widthClass = '';
	export let extraClass = '';
	export let min = 1;
	export let max = null;
	export let value = null;
</script>

<div class="{extraClass} {widthClass} input-number-container">
	{#if label}
		<label for="playlistr-input-number" class="block text-gray-300 text-sm mb-2">{label}</label>
	{/if}
	<input
		class="rounded-full px-4 py-1 text-black {widthClass}"
		id="playlistr-input-number"
		type="number"
		{min}
		{max}
		bind:value
	/>
</div>
