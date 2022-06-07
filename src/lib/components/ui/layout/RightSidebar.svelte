<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { playlists } from '$lib/stores/playlists';
	import { navigating } from '$app/stores';
	import { addToPlaylistsQueue } from '$lib/stores/playlists/addToPlaylistsQueue';
	import { truncate } from '$lib/utils/truncate';
	import { notification } from '$lib/stores/notification';
	import { addedToPlaylist } from '$lib/stores/playlists/addedToPlaylist';

	import Modal from '$lib/components/ui/modals/Modal.svelte';
	import Search from '../search/Search.svelte';
	import NavigationEntry from '$lib/components/ui/navigation/NavigationEntry.svelte';
	import Dropdown from '../forms/Dropdown.svelte';

	let session = getContext('session');

	const dispatch = createEventDispatcher();

	let showPlaylists = false;
	let isSearching = false;

	let isAddPlaylistModalOpen = false;
	let playlistEntries = [];
	let searchResults = null;

	let selectedTrack = null;
	let selectedPlaylist = null;

	$: if (searchResults) {
		dispatch('expand');
	} else {
		dispatch('collapse');
	}

	$: if ($navigating) {
		checkPathAndFetch('navigation');
	}

	function addToPlaylist(track) {
		// figure out if on a playlist page or not
		// if on a playlist page, add to that playlist
		if ($page.url.pathname.indexOf('/playlist/') > -1) {
			const playlistId = $page.url.pathname.split('/playlist/')[1];

			$addToPlaylistsQueue = [...$addToPlaylistsQueue, { playlist: playlistId, track }];

			return;
		}

		// if not on a playlist page, open a modal to select a playlist
		handleOpenPlaylistModal(track);
		$addSongToPlaylist;
	}

	function handleOpenPlaylistModal(track) {
		if (!$playlists) {
			return;
		}

		selectedTrack = track.uri;

		if (!playlistEntries.length) {
			$playlists.items.forEach((f) => {
				const toPush = {
					name: f.name,
					id: f.id
				};
				playlistEntries = [...playlistEntries, toPush];
			});
		}

		isAddPlaylistModalOpen = true;
	}

	function checkPathAndFetch(navigationType) {
		let pathToCheck = null;

		switch (navigationType) {
			case 'navigation':
				pathToCheck = $navigating.to.pathname;
				break;
			case 'mount':
				pathToCheck = $page.url.pathname;
				break;
		}

		if (pathToCheck.indexOf('playlist') > -1) {
			showPlaylists = true;
		} else {
			showPlaylists = false;
		}

		if (showPlaylists) {
			if (!$playlists?.length) {
				getPlaylists();
			}
		}
	}

	function handleSearchState() {
		isSearching = !isSearching;
	}

	async function handleSearch(query) {
		const data = await fetch(`https://api.spotify.com/v1/search?type=track&q=${query}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${session.access_token}`
			}
		});
		searchResults = await data.json();
	}

	function handleClear() {
		handleSearchState();
		searchResults = null;
	}

	function handleCloseSearch() {
		searchResults = null;
		isSearching = false;
	}

	function handlePlaylistModalClose() {
		isAddPlaylistModalOpen = false;
	}

	async function addSongToPlaylist() {
		try {
			const data = await fetch(
				`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks?uris=${selectedTrack}`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${session.access_token}`
					}
				}
			);
			const response = await data.json();

			if (!response.ok) {
				console.error(response);
			}
		} catch (error) {
			console.error(error);
		}

		$notification = {
			type: 'success',
			message: 'Song added to playlist!'
		};

		$addedToPlaylist = {
			playlist: selectedPlaylist,
			track: selectedTrack
		};

		handlePlaylistModalClose();
	}

	async function getPlaylists() {
		const data = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
			headers: {
				Authorization: `Bearer ${session.access_token}`
			}
		});
		$playlists = await data.json();
	}

	onMount(() => {
		checkPathAndFetch('mount');
	});
</script>

<div
	class="px-4 flex flex-wrap right-sidebar-content rounded-3xl text-left justify-start min-h-scren h-full p-3"
>
	<div class="navigation h-full w-full flex-1">
		<div class="features">
			<NavigationEntry
				sidebar
				noBorder
				on:click={() => goto('/create-playlist')}
				svg={`
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `}
			>
				Create new playlist
			</NavigationEntry>

			{#if isSearching}
				<div in:fade={{ duration: 200 }} class="search-input">
					<Search
						isFocused
						placeholder="Look for songs"
						on:search={(e) => handleSearch(e.detail.query)}
						on:clear={handleClear}
					/>
				</div>
			{:else}
				<div in:fade={{ duration: 200 }} class="search-trigger">
					<NavigationEntry
						sidebar
						noBorder
						on:click={handleSearchState}
						svg={`
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						`}
					>
						Search
					</NavigationEntry>
				</div>
			{/if}
			<hr class="my-4" />

			{#if searchResults}
				<!--
				TODO make this into a component
				to reuse for mobile
			-->
				<div class="search-results relative pt-6">
					<!-- close button-->
					<div on:click={handleCloseSearch} class="close-button absolute right-2 top-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white hover:text-green-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>
					<!-- display tracks from search -->
					{#each searchResults?.tracks?.items as track}
						<div class="track track px-4 py-3 hover:bg-green-900 flex gap-3 items-center">
							<div class="track-album-image">
								<img class="track-image" src={track.album.images[0]?.url} alt={track.album.name} />
							</div>
							<div class="track-name">
								{truncate(track.name, 30)}
								<span class="block artist-name">
									{#each track.artists as artist, x}
										<span class={x !== 0 ? 'text-gray-400' : 'text-gray-300'}>
											{x !== 0 ? '/ ' : ''}{truncate(artist.name, 40)}
										</span>
									{/each}
								</span>
							</div>
							<div class="actions flex gap-3 justify-end ml-auto items-center">
								<div on:click={() => addToPlaylist(track)}>
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
					<!-- end display tracks -->
				</div>
			{:else if showPlaylists}
				<div class="playlist-entries">
					{#each $playlists?.items || [] as playlist, i}
						<div
							in:fade|local={{ duration: 100 }}
							on:click={goto(`/playlist/${playlist.id}`)}
							class="playlist-entry pb-3 text-white/50 hover:text-white cursor-pointer"
						>
							{playlist.name}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<Modal on:clickOutside={handlePlaylistModalClose} open={isAddPlaylistModalOpen}>
	<h2 class="text-xl mb-4">Add to which playlist?</h2>
	{#if playlistEntries}
		<Dropdown entries={playlistEntries} bind:value={selectedPlaylist} />
	{/if}
	<div class="toggles mt-6 flex gap-3 uppercase font-bold">
		<button
			on:click={handlePlaylistModalClose}
			class="uppercase font-bold text-gray-500 hover:text-gray-800">Cancel</button
		>
		<button
			on:click={() => addSongToPlaylist(selectedPlaylist, selectedTrack)}
			class="bg-green-500 hover:bg-green-600 uppercase font-bold px-3 py-1 rounded-full">Add</button
		>
	</div>
</Modal>

<style>
	.right-sidebar-content {
		background: rgba(0, 0, 0, 0.4);
		max-width: 100%;
	}

	.playlist-entries {
		max-height: 70vh;
		overflow-y: auto;
	}
	hr {
		border-top: 1px solid rgba(255, 255, 255, 0.2);
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

	.artist-name {
		font-size: 0.7rem;
	}
</style>
