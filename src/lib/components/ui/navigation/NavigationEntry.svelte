<script>
	export let svg = null;
	export let extraClass = '';
	export let backgroundClass = '';
	export let noBorder = false;
	export let cta = false;
</script>

<div
	on:click
	class="relative {backgroundClass} {cta
		? 'bg-green-500 text-neutral-800 hover:blue-800 text-xs uppercase font-semibold hover:text-white hover:bg-blue-800 hover:border-blue-900'
		: 'bg-transparent'}
		rounded-full cursor-pointer navigation-entry items-center w-full py-2 {noBorder
		? ''
		: 'border-b border-green-800'} flex pl-4 mb-2 {svg ? 'pr-10' : 'pr-4'} {extraClass}"
>
	{#if svg}
		<span class="text text-sm font-semibold my-0 py-0">
			<slot />
		</span>
		<div class="icon absolute right-2 top-1/2 transform -translate-y-1/2">{@html svg}</div>
	{:else}
		<span class="text text-sm font-semibold my-0 py-0">
			<slot />
		</span>
	{/if}
</div>
