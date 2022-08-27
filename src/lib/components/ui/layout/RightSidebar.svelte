<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { playlists } from '$lib/stores/playlists';
	import { navigating } from '$app/stores';
	import { addToPlaylistsQueue } from '$lib/stores/playlists/addToPlaylistsQueue';
	import { notification } from '$lib/stores/notification';
	import { addedToPlaylist } from '$lib/stores/playlists/addedToPlaylist';
	import SearchResults from '../search/SearchResults.svelte';
	import Button from '../buttons/Button.svelte';

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

	// modal button states
	let addDone = false;
	let addLoading = false;
	let addError = false;
	let pathToCheck = null;

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
			addDone = true;
			return;
		}

		// if not on a playlist page, open a modal to select a playlist
		handleOpenPlaylistModal(track);
	}

	function handleOpenPlaylistModal(track) {
		addDone = false;
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

	function checkPath(navigationType) {
		switch (navigationType) {
			case 'navigation':
				pathToCheck = $navigating.to.pathname;
				break;
			case 'mount':
				pathToCheck = $page.url.pathname;
				break;
		}
	}

	function checkPathAndFetch(navigationType) {
		checkPath(navigationType);

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

	function handleClear() {
		handleSearchState();
		searchResults = null;
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

	function handleCloseSearch() {
		searchResults = null;
		isSearching = false;
	}

	function handlePlaylistModalClose() {
		isAddPlaylistModalOpen = false;
	}

	async function addSongToPlaylist() {
		if (!selectedTrack || !selectedPlaylist) {
			addError = true;
			return;
		}

		addLoading = true;
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
			addError = true;
			console.error(error);
		}

		$notification = {
			type: 'success',
			message: 'Song added to playlist!'
		};

		addDone = true;

		$addedToPlaylist = {
			playlist: selectedPlaylist,
			track: selectedTrack
		};

		setTimeout(() => {
			handlePlaylistModalClose();
			addDone = false;
		}, 800);
	}

	function handleImprovement() {
		// check if on a playlist page or not
		const path = checkPath('mount');

		if (path.indexOf('/playlist') > -1) {
			return;
		}

		// if not on a playlist page, open a modal to select a playlist
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

			<NavigationEntry
				sidebar
				noBorder
				on:click={handleImprovement}
				svg={`
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
					</svg>
				`}
			>
				Improve your playlist
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

			{#if showPlaylists}
				<hr class="my-4" />
			{/if}

			{#if searchResults}
				<SearchResults
					on:addSongToPlaylist={(e) => addToPlaylist(e.detail.track)}
					on:closeSearch={handleCloseSearch}
					{searchResults}
				/>
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
		<Button
			loading={addLoading}
			error={addError}
			done={addDone}
			on:click={() => addSongToPlaylist(selectedPlaylist, selectedTrack)}>Add</Button
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
</style>
