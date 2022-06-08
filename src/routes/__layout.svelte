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
	import Footer from '$lib/components/footer/Footer.svelte';
	import LoginScreen from '$lib/components/login_screen/LoginScreen.svelte';
	import Notifications from '$lib/components/ui/notifications/Notifications.svelte';
	import RightSidebar from '$lib/components/ui/layout/RightSidebar.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import NavigationEntry from '$lib/components/ui/navigation/NavigationEntry.svelte';
	export let session;
	let isLoggedIn = false;
	let currentUser = null;
	let expiredToken = false;
	let isMobile = false;
	let innerWidth = null;
	let isExpanded = false;
	let isLoading = false;

	$: if (currentUser) {
		user.set(currentUser);
	}

	$: if (session?.authenticated || currentUser) {
		isLoggedIn = true;
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

		isLoading = true;

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
				isLoading = false;
			}
			isLoading = false;
		}
	});
</script>

<Header {expiredToken} {session} {currentUser} />

<div class="container main-content mx-auto px-8 md:px-4">
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
			<div class="right-sidebar mt-8 {isExpanded ? 'expanded' : ''}">
				<RightSidebar
					on:expand={() => (isExpanded = true)}
					on:collapse={() => (isExpanded = false)}
					{currentUser}
				/>
			</div>
		</div>
	{/if}
</div>

{#if isMobile && isLoggedIn && !expiredToken}
	<div class="create-playlist w-5/6 fixed bottom-2 right-2">
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
{/if}

<Footer {isMobile} />

<Notifications notification={$notification} />

<svelte:window bind:innerWidth />

<style>
	:global(body) {
		background-image: linear-gradient(to right, #141e30, #243b55);
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
		transition: 0.3s ease;
		min-width: 250px;
		max-width: 250px;
	}

	.create-playlist {
		max-width: 250px;
	}

	.expanded {
		min-width: 350px !important;
		max-width: 350px !important;
	}

	.main-content {
		min-height: 60vh;
	}
</style>
