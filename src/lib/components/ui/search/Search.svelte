<script>
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let placeholder = '';
	export let isFocused = false;
	export let isMobile = false;
	export let clearQuery = false;

	let inputElement = null;

	let queryString = '';

	let timer;
	const debounce = (func, time) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func();
		}, time);
	};

	function handleKeys(e) {
		function dispatchSearch() {
			dispatch('search', {
				query: e.target.value
			});
		}

		queryString = e.target.value;
		debounce(dispatchSearch, 800);
	}

	function handleClear() {
		if (clearQuery) {
			inputElement.value = '';
			queryString = '';
		}

		dispatch('clear');
	}

	onMount(() => {
		if (isFocused) {
			inputElement.focus();
		}
	});
</script>

<div class="search relative">
	<input
		bind:this={inputElement}
		class="rounded-full pl-4 pr-9 w-full {isMobile
			? 'py-4 text-lg'
			: 'py-2'} focus:bg-white focus:text-black bg-zinc-800 focus:outline-none focus:ring-0"
		type="text"
		{placeholder}
		on:keyup={handleKeys}
		on:blur={() => (isFocused = false)}
		on:focus={() => (isFocused = true)}
	/>
	<div
		class="clear absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2"
		on:click={handleClear}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="{isMobile ? 'h-8 w-8' : 'h-5 w-5'} {isFocused
				? 'text-gray-800'
				: 'text-white'} {queryString !== '' && !isFocused ? 'hover:text-white' : ''}"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</div>
</div>
