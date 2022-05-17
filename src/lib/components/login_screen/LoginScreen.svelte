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

<div class="login-screen relative text-center mx-auto w-max mt-24 p-8 rounded-2xl">
	{#if expiredToken}
		<div class="text-6xl font-extrabold tracking-tighter mb-4">oh no!</div>
		Your session has expired, please login again
		<div class="my-4 w-full text-center flex justify-center">
			<LoginWithSpotify on:click={() => goto('/api/auth/login')} />
		</div>
	{:else}
		<div class="logged-out-screen text-center items-center">
			<div class="login-info mx-auto jusitfy-center">
				<h1 class="text-6xl font-extrabold tracking-tighter">Welcome</h1>
				<h3 class="mb-4">Create and manage your Spotify playlists.</h3>
				<div class="login-button mx-auto w-full text-center">
					<LoginWithSpotify on:click={() => goto('/api/auth/login')} extraClass="mx-auto" />
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.login-screen {
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(10px);
	}
</style>
