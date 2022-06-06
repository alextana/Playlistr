<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';

	import { playlists } from '$lib/stores/playlists';
	import { navigating } from '$app/stores';
	import NavigationEntry from '$lib/components/ui/navigation/NavigationEntry.svelte';

	function handleSearch() {}

	let session = getContext('session');

	let showPlaylists = false;

	$: if ($navigating) {
		checkPathAndFetch('navigation');
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
				on:click={handleSearch}
				svg={`
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				`}
			>
				Search
			</NavigationEntry>
			<hr class="mb-4" />

			{#if showPlaylists}
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

<style>
	.right-sidebar-content {
		background: rgba(0, 0, 0, 0.4);
		max-width: 300px;
	}

	.playlist-entries {
		max-height: 50vh;
		overflow-y: scroll;
	}
	hr {
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}
</style>
