<script>
	import Search from '$lib/components/ui/search/Search.svelte';
	import PlaylistWizard from '$lib/components/widgets/PlaylistWizard.svelte';
	// TODO - create a playlist as soon as a a song is added

	let playlist = [];

	// function handleSearch(e) {
	// 	const { query } = e.detail;
	// }
</script>

<svelte:head>
	<title>Create a playlist | Playlistr</title>
</svelte:head>

<div class="playlist-creation">
	<div class="title flex gap-3 justify-between items-center mb-4">
		<h1 class="text-4xl font-extrabold tracking-tighter">Create a new playlist</h1>
		<!-- <div class="search">
			<Search on:search={handleSearch} placeholder="Search for a song" />
		</div> -->
	</div>
	{#if !playlist.length}
		<PlaylistWizard />
	{:else}
		<div class="playlist-display flex gap-3">
			<div class="playlist-tracks flex-1">current tracks</div>
			<div class="search-results flex-1">search results</div>
		</div>
	{/if}
</div>
