<script>
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	export let elements = null;
	export let isPlaylist = false;
	export let toBeHighlighted = null;

	export let node = null;

	let playlistElements = [];

	$: if (isPlaylist || elements) {
		playlistElements = elements.map((element) => {
			return element.track;
		});
	}

	function emitAddToPlaylist(track) {
		dispatch('addToPlaylist', {
			track: track
		});
	}

	function emitRemoveFromPlaylist(track) {
		dispatch('removeFromPlaylist', {
			track: track
		});
	}
</script>

<div class="track-box overflow-hidden">
	<div class="track-container overflow-y-auto overflow-x-hidden" bind:this={node}>
		{#each isPlaylist ? playlistElements : elements as track, i}
			{#if track}
				<div
					in:fly={{ duration: 150, x: 200, delay: i * 20 }}
					class="{toBeHighlighted === track
						? 'highlighted'
						: ''} track px-4 py-3 hover:bg-green-900 flex gap-3 items-center"
				>
					<div class="track-number mr-2 text-gray-300">
						{i + 1}
					</div>
					<div class="track-album-image">
						<img class="w-8 h-8" src={track.album.images[0]?.url} alt={track.album.name} />
					</div>
					<div class="track-name">
						{track.name}
						<span class="block text-sm">
							{#each track.artists as artist, x}
								<span class={x !== 0 ? 'text-gray-400' : 'text-gray-300'}>
									{x !== 0 ? '/ ' : ''}{artist.name}
								</span>
							{/each}
						</span>
					</div>
					<div class="ml-auto pr-4 text-gray-400">
						{#if isPlaylist}
							<svg
								on:click={() => emitRemoveFromPlaylist(track)}
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 hover:text-green-500 cursor-pointer"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						{:else}
							<svg
								on:click={() => emitAddToPlaylist(track)}
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 hover:text-green-500 cursor-pointer"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.track-container {
		max-height: 80vh;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(10px);
	}

	.highlighted {
		animation-name: highlight;
		animation-duration: 2.5s;
	}

	@keyframes highlight {
		0% {
			background: rgba(0, 0, 0, 0.4);
		}
		50% {
			background: rgba(10, 99, 196, 0.8);
		}
		0% {
			background: rgba(0, 0, 0, 0.4);
		}
	}
</style>
