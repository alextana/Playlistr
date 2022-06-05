<script>
	import { onMount } from 'svelte';
	import { scale, fly, fade } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { playlists } from '$lib/stores/playlists';
	import Greeting from '$lib/components/greeting/Greeting.svelte';
	import { goto } from '$app/navigation';
	import { clickOutside } from 'svelte-use-click-outside';
	import { notification } from '$lib/stores/notification';

	let session = getContext('session');

	let currentlyOpen = null;

	async function getPlaylists() {
		const data = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
			headers: {
				Authorization: `Bearer ${session.access_token}`
			}
		});
		playlists.set(await data.json());
	}

	onMount(() => {
		if (!$playlists?.length) {
			getPlaylists();
		}
	});

	function handlePlaylistClick(e, playlist) {
		if (e.target.classList.contains('delete')) {
			openDeleteModal(playlist);
			return;
		}

		goto(`/playlist/${playlist.id}`);
	}

	function openDeleteModal(playlist) {
		currentlyOpen = playlist;
	}

	async function deletePlaylist(playlist) {
		try {
			const deleted = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/followers`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			});
			if (!deleted.ok) {
				$notification = {
					type: 'error',
					message: `Error removing playlist`
				};
			} else {
				$notification = {
					type: 'success',
					message: `${playlist.name} removed from your library`
				};
			}
			getPlaylists();
			currentlyOpen = null;
		} catch (error) {
			console.error(error);
		}
	}
</script>

<svelte:head>
	<title>Home | Playlistr</title>
</svelte:head>

<div class="container mx-auto">
	{#if session}
		<Greeting {session} />
	{/if}

	<div
		class="playlist-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
	>
		{#each $playlists?.items || [] as playlist, i}
			{#if playlist}
				<div
					in:scale={{ duration: 300, delay: i * 30 }}
					on:click={(e) => handlePlaylistClick(e, playlist)}
					class="playlist-item transition-all p-4 hover:bg-teal-800 hover:-translate-y-1 rounded-3xl cursor-pointer"
				>
					<div class="playlist-image rounded-3xl overflow-hidden mb-4">
						{#if playlist?.images.length}
							<img src={playlist.images[0]?.url} alt="Playlist" />
						{:else}
							<img src="/images/no-image.jpg" alt="No tunes in playlist" />
						{/if}
					</div>
					<div class="playlist-info flex gap-3 items-center">
						<div class="name-total flex-grow">
							<div class="playlist-name font-bold text-xl tracking-tighter">
								{playlist.name}
							</div>
							<div class="playlist-track-total">
								{playlist.tracks.total} tracks
							</div>
						</div>
						<div class="delete relative z-50">
							<svg
								on:click={() => openDeleteModal(playlist)}
								xmlns="http://www.w3.org/2000/svg"
								class="delete h-6 w-6 text-white/30 hover:text-red-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									class="delete"
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

{#if currentlyOpen}
	<div
		transition:fade={{ duration: 300 }}
		class="overlay fixed top-0 left-0 z-30 bg-black/40 backdrop-blur-md h-screen w-screen"
	/>
	<div
		transition:fly={{ duration: 300, y: -100 }}
		use:clickOutside={() => (currentlyOpen = null)}
		class="fixed delete-modal p-6 z-40 bg-white shadow-2xl text-neutral-800 rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
	>
		<h2 class="text-xl">
			Delete <span class="font-extrabold">{currentlyOpen?.name}</span>?
		</h2>
		<p class="text-md">this action cannot be undone.</p>
		<div class="toggles mt-6 flex gap-3 uppercase font-bold">
			<button on:click={() => (currentlyOpen = null)} class="uppercase font-bold text-gray-500"
				>Cancel</button
			>
			<button
				on:click={() => deletePlaylist(currentlyOpen)}
				class="bg-red-500 hover:bg-red-600 uppercase font-bold px-3 py-1 rounded-full"
				>Delete</button
			>
		</div>
	</div>
{/if}

<style>
	.playlist-item {
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(10px);
	}
	.delete-modal {
		min-width: 300px;
	}
</style>
