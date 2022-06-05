<script>
	import { goto } from '$app/navigation';
	import NavigationEntry from '$lib/components/ui/navigation/NavigationEntry.svelte';
</script>

<div
	class="px-4 flex flex-wrap right-sidebar-content rounded-3xl text-left justify-start min-h-scren h-full p-3"
>
	<div class="navigation h-full w-full flex-1">
		<div class="features">
			<NavigationEntry
				cta
				on:click={() => goto('/create-playlist')}
				svg={`
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `}
			>
				Create new playlist
			</NavigationEntry>
		</div>
	</div>
</div>

<style>
	.right-sidebar-content {
		background: rgba(0, 0, 0, 0.3);
		max-width: 300px;
	}
</style>
