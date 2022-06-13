<script>
	import { createEventDispatcher } from 'svelte';
	import { truncate } from '$lib/utils/truncate';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let searchResults = null;
	export let hasClose = true;
	export let hasScroll = false;
	export let isMobile = false;

	function handleDispatchTrack(track) {
		dispatch('addSongToPlaylist', {
			track
		});
	}
</script>

<div
	class="search-results {hasScroll
		? 'overflow-y-auto mobile-search'
		: ''} bg-black/30 p-3 mt-6 rounded-xl relative pt-6"
>
	<!-- close button-->
	{#if hasClose}
		<div
			on:click={() => dispatch('closeSearch')}
			class="close-button bg-white rounded-full p-1 hover:bg-green-500 cursor-pointer text-black absolute right-0 -top-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-gray-800"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</div>
	{/if}
	<!-- display tracks from search -->
	{#if searchResults?.tracks?.items?.length}
		{#each searchResults?.tracks?.items as track, i}
			<div
				in:fly={{ duration: 100, delay: i * 50, x: 30 }}
				class="track {isMobile
					? 'mobile-text'
					: ''} track px-4 py-3 hover:bg-green-900 flex gap-3 items-center"
			>
				<div class="track-album-image">
					<img class="track-image" src={track.album.images[0]?.url} alt={track.album.name} />
				</div>
				<div class="track-name">
					{truncate(track.name, 30)}
					<span class="block artist-name {isMobile ? 'mobile-text' : ''}">
						{#each track.artists as artist, x}
							<span class={x !== 0 ? 'text-gray-400' : 'text-gray-300'}>
								{x !== 0 ? '/ ' : ''}{truncate(artist.name, 40)}
							</span>
						{/each}
					</span>
				</div>
				<div class="actions flex gap-3 justify-end ml-auto items-center">
					<div on:click={() => handleDispatchTrack(track)}>
						<svg
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
					</div>
					<!--<div>add to other playlist</div>-->
				</div>
			</div>
		{/each}
	{:else}
		<div
			class="no-tracks text-white/30 absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap justify-center w-full"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-32 w-32"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<h3 class="text-3xl font-light">Insert text to search..</h3>
		</div>
	{/if}
	<!-- end display tracks -->
</div>

<style>
	.search-results {
		min-height: 300px;
	}

	.track {
		font-size: 0.8rem;
	}

	.track-image {
		min-width: 30px;
		min-height: 30px;
		max-width: 30px;
		max-height: 30px;
	}

	.track.mobile-text {
		font-size: 1.2rem !important;
	}

	.artist-name.mobile-text {
		font-size: 0.95rem !important;
	}

	.artist-name {
		font-size: 0.7rem;
	}

	.mobile-search {
		max-height: 80vh;
	}
</style>
