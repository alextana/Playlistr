<script context="module">
	export async function load({ params, session }) {
		const id = params.id;
		return { props: { id, session } };
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { notification } from '$lib/stores/notification';

	import ActionButton from '$lib/components/ui/buttons/ActionButton.svelte';
	import ElementList from '$lib/components/ui/layout/ElementList.svelte';
	export let id;
	export let session;
	let playlist = null;
	let recommendations = null;
	let relatedArtists = null;
	let currentTracks = null;
	let toBeHighlighted = null;

	async function getRecommendations() {
		// check playlist and check artists, then look for recommendations based on that
		if (!playlist) return;
		let artists = [];

		for (let track of playlist.tracks.items) {
			for (let artist of track.track.artists) {
				artists.push(artist.id);
			}
		}

		artists = [...new Set(artists)];

		// if no artists or if there are too few then get related artists.
		if (!artists.length || artists.length < 3) {
			try {
				const data = await fetch(
					`https://api.spotify.com/v1/artists/${playlist.tracks.items[0].track.artists[0].id}/related-artists`,
					{
						headers: {
							Authorization: `Bearer ${session.access_token}`
						}
					}
				);
				relatedArtists = await data.json();
			} catch (error) {
				console.error(error);
			}

			if (relatedArtists) {
				artists = relatedArtists?.artists.map(function (artist) {
					return artist['id'];
				});
			}
		}

		// enough artists, send them as seed
		const artistsToSend = artists.sort(() => 0.5 - Math.random()).slice(0, 5);

		try {
			const response = await fetch(
				`https://api.spotify.com/v1/recommendations?seed_artists=${artistsToSend.join(',')}`,
				{
					headers: {
						Authorization: `Bearer ${session.access_token}`
					}
				}
			);
			recommendations = await response.json();
		} catch (error) {
			console.error(error);
		}
	}

	async function getPlaylist() {
		try {
			const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			});
			playlist = await response.json();
		} catch (error) {
			console.error(error);
		}

		getRecommendations();
	}

	onMount(() => {
		getPlaylist();
	});

	async function addToPlaylist(track) {
		// TODO - check if track is already in playlist
		try {
			const data = await fetch(
				`https://api.spotify.com/v1/playlists/${playlist.id}/tracks?uris=${track.uri}`,
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

			const trackToPush = {
				track
			};
			$notification = {
				type: 'success',
				message: `${track.name} added to ${playlist.name}`
			};
			playlist.tracks.items.push(trackToPush);

			recommendations.tracks = recommendations.tracks.filter((f) => f.name !== track.name);
			playlist = playlist;

			setTimeout(() => {
				currentTracks.scrollTop = currentTracks.scrollHeight;
			}, 500);
		} catch (error) {
			$notification = {
				type: 'error',
				message: `Couldn't add track to ${playlist.name}`
			};
			console.error(error);
		}
	}

	async function removeFromPlaylist(track) {
		const trackToDelete = {
			tracks: [{ uri: track.uri }]
		};
		try {
			const data = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${session.access_token}`
				},
				body: JSON.stringify(trackToDelete)
			});
			const response = await data.json();

			if (!response.ok) {
				console.error(response);
			}

			playlist.tracks.items = playlist.tracks.items.filter(
				(f) => f.track.id !== track.id && f.track_number !== track.track_number
			);
			playlist = playlist;

			$notification = {
				type: 'success',
				message: `${track.name} removed from ${playlist.name}`
			};
		} catch (error) {
			console.error(error);
			$notification = {
				type: 'error',
				message: `Couldn't remove track from ${playlist.name}`
			};
		}
	}

	function highlightTrack(track) {
		toBeHighlighted = track;
	}
</script>

<svelte:head>
	{#if playlist}
		<title>{playlist.name} | Playlistr</title>
	{:else}
		<title>Your playlist | Playlistr</title>
	{/if}
</svelte:head>

{#if playlist}
	<div class="playlist-details">
		<div class="playlist-title mb-4">
			<h1 class="text-4xl font-extrabold tracking-tighter">{playlist.name}</h1>
		</div>
		<div
			class="info-container flex-grow w-full justify-between flex flex-wrap md:flex-nowrap gap-3"
		>
			<div class="current-tracks w-full">
				<h3 class="text-2xl text-gray-400 font-light mb-2">Current tracks</h3>
				<ElementList
					on:removeFromPlaylist={(e) => removeFromPlaylist(e.detail.track)}
					isPlaylist
					elements={playlist.tracks.items}
					bind:node={currentTracks}
					{toBeHighlighted}
				/>
			</div>
			<div class="potential-new-tracks flex-grow w-full">
				{#if recommendations && recommendations.tracks}
					<div class="flex gap-3 justify-between items-center mb-2">
						<h3 class="text-2xl text-gray-400 font-light">Recommended tracks</h3>
						<div class="refresh-recommendations">
							<ActionButton on:click={getRecommendations}>Reshuffle</ActionButton>
						</div>
					</div>
					<ElementList
						on:addToPlaylist={(e) => addToPlaylist(e.detail.track)}
						on:addToPlaylist={(e) => highlightTrack(e.detail.track)}
						elements={recommendations.tracks}
					/>
				{/if}
			</div>
		</div>
	</div>
{/if}
