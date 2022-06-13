<script>
	import { onMount, getContext } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { navigating } from '$app/stores';
	import Search from '$lib/components/ui/search/Search.svelte';
	import SearchResults from '$lib/components/ui/search/SearchResults.svelte';
	import { addToPlaylistsQueue } from '$lib/stores/playlists/addToPlaylistsQueue';
	import { playlists } from '$lib/stores/playlists';
	import Modal from '$lib/components/ui/modals/Modal.svelte';
	import Button from '$lib/components/ui/buttons/Button.svelte';
	import Dropdown from '$lib/components/ui/forms/Dropdown.svelte';
	import { addedToPlaylist } from '$lib/stores/playlists/addedToPlaylist';
	import { notification } from '$lib/stores/notification';

	let session = getContext('session');

	let searchOpen = false;
	let isSearching = false;
	let searchResults = null;

	let selectedTrack = null;
	let selectedPlaylist = null;
	let isAddPlaylistModalOpen = false;
	let playlistEntries = [];

	// modal button states
	let addDone = false;
	let addLoading = false;
	let addError = false;

	let currentlyActive = '';

	$: if ($navigating) {
		checkPath('navigation');
	}

	$: if (searchOpen) {
		currentlyActive = 'Search';
	} else {
		checkPath('mount');
	}

	function handlePlaylistModalClose() {
		isAddPlaylistModalOpen = false;
	}

	async function handleSearching(query) {
		const data = await fetch(`https://api.spotify.com/v1/search?type=track&q=${query}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${session.access_token}`
			}
		});
		searchResults = await data.json();
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

	function checkPath(type) {
		let pathToCheck = null;

		switch (type) {
			case 'navigation':
				pathToCheck = $navigating.to.pathname;
				break;
			case 'mount':
				pathToCheck = $page.url.pathname;
				break;
		}

		switch (true) {
			case pathToCheck === '/' && !searchOpen:
				currentlyActive = 'Home';
				break;
			case pathToCheck === '/create-playlist':
				currentlyActive = 'New playlist';
				break;
			case !searchOpen:
				currentlyActive = '';
				break;
		}
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

	onMount(() => {
		checkPath('mount');
	});

	function handleSearchState() {
		isSearching = !isSearching;
	}

	function handleClear() {
		handleSearchState();
		searchResults = null;
	}

	const menus = [
		{
			name: 'Home',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
</svg>`,
			action: goHome
		},
		{
			name: 'Search',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>`,
			action: handleSearch
		},
		{
			name: 'New playlist',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
</svg>`,
			action: handlePlaylists
		}
	];

	function goHome() {
		goto('/');
		searchOpen = false;
	}

	function handleSearch() {
		searchOpen = true;
		currentlyActive = 'Search';
	}

	function handleCloseSearch() {}

	function handlePlaylists() {
		goto('/create-playlist');
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
</script>

<div
	class="bg-black/90 border-t border-gray-800 w-screen py-4 backdrop-blur-lg grid grid-cols-3 text-center"
>
	{#each menus as menu}
		<div
			class="menu w-full flex flex-wrap justify-center items-center"
			class:text-green-500={currentlyActive === menu.name}
			on:click={menu.action}
		>
			<div class="icon">{@html menu.icon}</div>
			<div class="text w-full">{menu.name}</div>
		</div>
	{/each}
</div>

{#if searchOpen}
	<div
		in:fly={{ duration: 300, x: 300 }}
		out:fly={{ duration: 300, x: -300 }}
		class="bg-gray-900 p-6 interaction-panel h-screen w-full fixed top-0 left-0 z-40"
	>
		<div in:fade={{ duration: 200 }} class="search-input flex gap-3 w-full items-center">
			<div class="back-button" on:click={() => (searchOpen = false)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</div>
			<div class="search w-full">
				<Search
					isFocused
					placeholder="Look for songs"
					on:search={(e) => handleSearching(e.detail.query)}
					on:clear={handleClear}
					clearQuery
					isMobile
				/>
			</div>
		</div>

		{#if searchResults}
			<SearchResults
				on:addSongToPlaylist={(e) => addToPlaylist(e.detail.track)}
				on:closeSearch={handleCloseSearch}
				{searchResults}
				hasScroll
				isMobile
				hasClose={false}
			/>
		{/if}
	</div>
{/if}

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
	.menu {
		border-right: 1px solid rgba(255, 255, 255, 0.2);
	}

	.menu:last-child {
		border-right: 0px;
	}

	.interaction-panel {
		z-index: -1;
	}
</style>
