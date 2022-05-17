<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import LoginWithSpotify from '../ui/buttons/LoginWithSpotify.svelte';
	export let expiredToken = false;
	export let session = null;

	onMount(() => {
		if (expiredToken) {
			goto(
				`/refresh-token?access_token=${session.access_token}&refresh_token=${session.refresh_token}`
			);
		}
	});
</script>

<div class="login-screen text-center mx-auto w-full bg-zinc-900 mt-24 p-8 rounded-2xl">
	{#if expiredToken}
		<div class="text-6xl font-extrabold tracking-tighter mb-4">oh no!</div>
		Your session has expired, please login again
		<div class="my-4 w-full text-center flex justify-center">
			<LoginWithSpotify on:click={() => goto('/api/auth/login')} />
		</div>
	{:else}
		let's log you in
	{/if}
</div>
