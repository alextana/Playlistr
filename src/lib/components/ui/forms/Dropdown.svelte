<script>
	export let entries = [];
	export let value = null;

	$: if (!value && !entries.length) {
		value = '';
	}

	$: if (!value && entries?.length) {
		value = entries[0].id;
	}
</script>

<div class="dropdown relative">
	<select
		class="appearance-none border rounded-full bg-gray-50 border-gray-200 pl-3 pr-6 py-2"
		bind:value
	>
		{#if !entries.length}
			<option value=""> Please select... </option>
		{/if}

		{#each entries || [] as entry}
			<option value={entry.id}>
				{entry.name}
			</option>
		{/each}
	</select>
	<span
		class="pointer-events-none icon h-6 w-6 absolute right-2 top-2/4 transform -translate-y-2/4 hover:bg-transparent"
	>
		<!-- expand more-->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="fill-current h-6 w-6"
			viewBox="0 0 24 24"
			fill="#000000"
			><path d="M0 0h24v24H0z" fill="none" /><path
				d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
			/></svg
		>
	</span>
</div>
