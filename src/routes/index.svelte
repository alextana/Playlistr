<script>
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { playlists } from '$lib/stores/playlists';
	import Greeting from '$lib/components/greeting/Greeting.svelte';
	let session = getContext('session');

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
				<a
					in:scale={{ duration: 300, delay: i * 30 }}
					href={`/playlist/${playlist.id}`}
					class="playlist-item transition-all p-4  hover:bg-teal-800 rounded-3xl cursor-pointer"
				>
					<div class="playlist-image rounded-3xl overflow-hidden mb-4">
						<img src={playlist.images[0]?.url} alt="Playlist" />
					</div>
					<div class="playlist-name font-bold text-xl tracking-tighter">
						{playlist.name}
					</div>
					<div class="playlist-track-total">
						{playlist.tracks.total} tracks
					</div>
				</a>
			{/if}
		{/each}
	</div>
</div>

<style>
	.playlist-item {
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(10px);
	}
</style>
