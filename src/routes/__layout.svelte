<script context="module">
	export async function load({ session }) {
		if (session.authenticated) {
			return {
				props: {
					session: session
				}
			};
		} else {
			return {
				props: {
					session: session
				}
			};
		}
	}
</script>

<script>
	import '../app.css';
	import { setContext } from 'svelte';
	import { notification } from '$lib/stores/notification';
	import { user } from '$lib/stores/user';
	import Header from '$lib/components/header/Header.svelte';
	import LoginScreen from '$lib/components/login_screen/LoginScreen.svelte';
	import Notifications from '$lib/components/ui/notifications/Notifications.svelte';
	import RightSidebar from '$lib/components/ui/layout/RightSidebar.svelte';
	import { onMount } from 'svelte';
	export let session;
	let isLoggedIn = false;
	let currentUser = null;
	let expiredToken = false;
	let isMobile = false;
	let innerWidth = null;

	$: if (currentUser) {
		user.set(currentUser);
	}

	$: if (session) {
		setContext('session', session);
	}

	$: if (innerWidth <= 992) {
		isMobile = true;
	} else {
		isMobile = false;
	}

	onMount(() => {
		if (session.authenticated) {
			isLoggedIn = true;
		}

		if (currentUser) {
			return;
		}

		getMe();

		async function getMe() {
			try {
				const data = await fetch('https://api.spotify.com/v1/me', {
					headers: {
						Authorization: `Bearer ${session.access_token}`
					}
				});
				if (!data.ok) {
					const res = await data.json();

					if (res.error.message === 'Invalid access token') {
						throw new Error(`Not logged in`);
					}

					if (data.status === 401) {
						isLoggedIn = false;
						expiredToken = true;
						throw new Error(`Auth token expired`);
					}
				}
				currentUser = await data.json();
			} catch (error) {
				console.error(error);
			}
		}
	});
</script>

<Header {expiredToken} {session} {currentUser} />

<div class="container mx-auto px-8 md:px-4">
	{#if expiredToken || !isLoggedIn}
		<LoginScreen {expiredToken} {session} />
	{:else if isMobile}
		<!-- mobile view -->
		<slot />
	{:else}
		<!-- desktop view -->
		<div class="flex gap-3">
			<div class="main-content mt-8 flex-grow">
				<slot />
			</div>
			<div class="right-sidebar mt-8">
				<RightSidebar {currentUser} />
			</div>
		</div>
	{/if}
</div>

<Notifications notification={$notification} />

<svelte:window bind:innerWidth />

<style>
	:global(body) {
		background: rgb(49, 24, 130);
		background: radial-gradient(
			circle,
			rgba(49, 24, 130, 1) 0%,
			rgba(18, 65, 97, 1) 37%,
			rgba(7, 25, 56, 1) 66%,
			rgba(1, 8, 20, 1) 90%
		);
		background-position: -50vh;
		color: rgb(240, 240, 240);
	}

	:global(::-webkit-scrollbar) {
		width: 0.5em;
	}

	:global(::-webkit-scrollbar-track) {
		padding: 5px;
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: rgba(255, 255, 255, 0.2);
		outline: 1px solid rgb(17, 17, 17);
	}

	.right-sidebar {
		min-width: 250px;
		max-width: 250px;
	}
</style>
