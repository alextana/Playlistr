<script>
	import { onMount } from 'svelte';
	export let editOnMount = false;
	export let extraClass = '';
	export let value;
	export let initialValue = '';
	let playlistInput = null;
	let isEditing = false;

	$: if (playlistInput) {
		handleWidth();

		playlistInput.focus();
	}

	onMount(() => {
		if (editOnMount) {
			isEditing = true;
			value = initialValue;
		}
	});

	function handleInputClick() {
		if (isEditing) {
			return;
		}

		isEditing = true;
	}

	function handleWidth() {
		playlistInput.style.maxWidth = '100%';
		playlistInput.style.width = `${
			playlistInput.value.length < 10 ? 20 : playlistInput.value.length
		}ch`;
	}
</script>

<div on:click={handleInputClick} class="editable-text {extraClass} ">
	{#if isEditing}
		<input
			bind:this={playlistInput}
			bind:value
			on:blur={() => {
				isEditing = false;
			}}
			on:keyup={handleWidth}
			type="text"
			class="transition-all bg-transparent border border-zinc-600 rounded-full px-4 py-1 focus:ring-green-100 focus:outline-green-500"
		/>
	{:else if !value}
		{initialValue}
	{:else}
		{value}
	{/if}
</div>

<style>
	.editable-text {
		max-width: 450px;
	}
</style>
