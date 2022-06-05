<script>
	import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
	import { user } from '$lib/stores/user';
	import { fly } from 'svelte/transition';
	import ActionButton from '../ui/buttons/ActionButton.svelte';
	import EditableText from '../ui/editable-inputs/EditableText.svelte';
	import { onMount, getContext } from 'svelte';
	import { notification } from '$lib/stores/notification';
	import { goto } from '$app/navigation';

	let session = getContext('session');
	let availableGenres = null;
	let selectedGenres = [];

	onMount(async () => {
		availableGenres = await getAvailableGenres();
	});

	async function getAvailableGenres() {
		try {
			const data = await fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			});
			return await data.json();
		} catch (error) {
			console.error(error);
		}
	}

	const playlistPurposes = [
		{
			id: 1,
			name: 'Working out',
			icon: `💪`,
			seeds: {
				min_energy: 0.6,
				// min_tempo: 160,
				min_danceability: 0.6
			}
		},
		{
			id: 2,
			name: 'Traveling',
			icon: `🏝`,
			seeds: {
				max_energy: 0.6,
				max_tempo: 160
			}
		},
		{
			id: 3,
			name: 'Chilling',
			icon: `😌`,
			seeds: {
				max_energy: 0.6,
				max_tempo: 150
			}
		},
		{
			id: 4,
			name: 'Partying',
			icon: `🎉`,
			seeds: {
				min_danceability: 0.7,
				max_tempo: 160
			}
		},
		{
			id: 5,
			name: 'Gaming',
			icon: `🎮`,
			seeds: {
				min_energy: 0.3,
				min_popularity: 50
			}
		},
		{
			id: 6,
			name: 'Anything',
			icon: `🙌`
		}
	];

	const amountOfTracks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

	let selectedPurpose = null;
	let selectedAmount = null;
	let playlistName = null;

	const randomName = uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
		separator: ' ',
		length: 3
	});

	async function generatePlaylist() {
		// generate playlist here
		if (!selectedPurpose || !selectedAmount || !playlistName || !$user?.id) {
			// TODO handle errors
			return;
		}

		const seeds = selectedPurpose.seeds;
		const genres = selectedPurpose.seed_genres;
		const name = {
			name: playlistName
		};
		const amount = selectedAmount;

		const seedString = Object.keys(seeds)
			.map((key) => key + '=' + Number(seeds[key]))
			.join('&');

		const queryString = seedString + '&limit=' + amount;

		// first create playlist then add items to them
		let created = null;
		let seed_artists = null;

		try {
			const data = await fetch(`https://api.spotify.com/v1/users/${$user.id}/playlists`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${session.access_token}`
				},
				body: JSON.stringify(name)
			});
			created = await data.json();
		} catch (error) {
			console.error(error);
		}

		if (created && !selectedGenres.length) {
			// find artist seed
			try {
				const offset = Math.floor(Math.random() * 10);
				const artistSeedData = await fetch(
					`https://api.spotify.com/v1/me/top/artists?limit=5&offset=${offset}`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${session.access_token}`
						}
					}
				);
				const artistsData = await artistSeedData.json();
				seed_artists = artistsData?.items.map(function (artist) {
					return artist['id'];
				});
			} catch (error) {
				console.error(error);
			}
		}

		const playlistId = created.id;
		let recommendations = null;
		// add tracks to playlist
		try {
			if (genres?.length) {
				selectedGenres.push(genres);
			}

			const seeds_string = seed_artists
				? 'seed_artists=' + seed_artists.join(',')
				: 'seed_genres=' + selectedGenres.join(',');

			const recommendationsData = await fetch(
				`https://api.spotify.com/v1/recommendations?${seeds_string}&${queryString}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${session.access_token}`
					}
				}
			);

			recommendations = await recommendationsData.json();
		} catch (error) {
			console.error(error);
		}

		const tracks = recommendations?.tracks.map((track) => track.uri);

		if (tracks) {
			try {
				const addToPlaylist = await fetch(
					`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${tracks.join(',')}`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${session.access_token}`
						}
					}
				);
				if (!addToPlaylist.ok) {
					console.error('error adding to playlist');
					$notification = {
						type: 'error',
						message: `Error adding to playlist`
					};
				} else {
					$notification = {
						type: 'success',
						message: `Playlist ${created.name} created!`
					};
					goto('/playlist/' + created.id);
				}
			} catch (error) {
				console.error(rrror);
			}
		}
	}

	function handleGenres(genre) {
		if (selectedGenres.length === 3 && !selectedGenres.includes(genre)) {
			$notification = {
				type: 'error',
				message: `You can only select a max of 3 genres`
			};
			return;
		}

		if (selectedGenres.includes(genre)) {
			selectedGenres = selectedGenres.filter((g) => g !== genre);
		} else {
			selectedGenres.push(genre);
		}
		selectedGenres = selectedGenres;
	}

	// function resetSelections () {
	//   selectedPurpose = null;
	//   selectedAmount = null;
	//   playlistName = null;
	//   selectedGenres = [];
	// }
</script>

<div class="playlist-wizard mt-8 text-center rounded-2xl p-8">
	<div class="playlist-name text-left mb-4">
		<h3 class="text-xs uppercase font-semibold mb-1">New Playlist</h3>
		<EditableText
			bind:value={playlistName}
			extraClass="text-2xl"
			editOnMount
			initialValue={randomName}
		/>
	</div>
	<h2 class="text-xl font-light text-gray-300 mb-4">What's the purpose of the playlist?</h2>
	<div class="playlist-purpose justify-center flex flex-wrap gap-3 mb-4">
		{#each playlistPurposes as purpose}
			<div
				on:click={() => {
					selectedPurpose = purpose;
				}}
				class="{selectedPurpose?.id === purpose.id
					? 'selected'
					: 'border-transparent'} border playlist-purpose-item cursor-pointer hover:bg-green-600 rounded-md p-4 w-36 text-center text-sm uppercase font-semibold"
			>
				<div class="purpose-icon text-4xl mb-2">
					{purpose.icon}
				</div>
				<div class="purpose-name">
					{purpose.name}
				</div>
			</div>
		{/each}
	</div>
	{#if selectedPurpose}
		<div class="select-genres mx-auto mb-4">
			<h2 class="text-xl font-light text-gray-300 mb-4">
				Select up to 3 genres (or none if you don't care)
				<small class="block text-xs">
					if you don't select a genre we'll guess tracks based on your top artists
				</small>
			</h2>
			<div class="genres flex gap-3 flex-wrap justify-center">
				{#each availableGenres.genres || [] as genre, i}
					<div
						in:fly={{ duration: 80, delay: i * 10, y: -10 }}
						on:click={() => handleGenres(genre)}
						class="{selectedGenres.filter((f) => f === genre).length
							? 'selected'
							: 'border-transparent'} border playlist-purpose-item cursor-pointer bg-black/20 hover:bg-green-600 border-white rounded-md p-2 w-max text-center text-sm uppercase font-semibold"
					>
						{genre}
					</div>
				{/each}
			</div>
		</div>
		<div class="number-of-tracks mx-auto mb-8">
			<h2 class="text-xl font-light text-gray-300 mb-4">
				How many tracks would you like to add? (up to 100)
			</h2>
			<div class="predefined-amount gap-3 flex flex-wrap justify-center mb-4">
				{#each amountOfTracks as amount}
					<div
						on:click={() => {
							selectedAmount = amount;
						}}
						class="{selectedAmount === amount
							? 'selected'
							: 'border-transparent'} border playlist-purpose-item cursor-pointer hover:bg-green-600 rounded-md p-4 w-max text-center text-sm uppercase font-semibold"
					>
						{amount}
					</div>
				{/each}
			</div>
			<!-- <InputNumber extraClass="mx-auto" widthClass="w-max" min="1" max="100" value="20" /> -->
		</div>
	{/if}

	{#if selectedPurpose && selectedAmount}
		<div class="finalise-playlist mt-4">
			<ActionButton green={true} on:click={generatePlaylist}>Generate playlist</ActionButton>
		</div>
	{/if}
</div>

<style>
	.playlist-wizard {
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(10px);
	}
	.playlist-purpose-item {
		transition: 0.1s ease;
		font-size: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.playlist-purpose-item:hover {
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.selected {
		background: green;
	}
</style>
