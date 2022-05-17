<script>
	import { onMount } from 'svelte';
	import { Icon, Logout } from 'svelte-hero-icons';

	export let session;
	export let expiredToken;
	export let currentUser;
	let isLoggedIn = false;

	onMount(() => {
		if (session?.authenticated) {
			isLoggedIn = true;
		}
	});
</script>

<div class="container mx-auto px-8 md:px-4">
	<div class="header-container flex justify-between items-center py-2">
		<a href="/" class="logo text-3xl tracking-tight font-extrabold">
			<div class="flex gap-1 items-center logo-group">
				<div class="logo-icon transform rotate-x-90">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
						/>
					</svg>
				</div>
				<div class="logo-name">
					<span class="font-extrabold italic tracking-tighter text-xl my-0">playlistr</span>
					<!-- <span class="block italic text-gray-400 font-light -mt-1 text-base">for spotify</span> -->
				</div>
			</div>
		</a>
		<div class="name-image-logout items-center flex gap-3">
			{#if currentUser}
				{#if currentUser?.images[0]?.url}
					<img
						class="rounded-full w-8 h-8"
						src={currentUser?.images[0].url}
						alt={currentUser.display_name}
					/>
				{/if}
				<p class="hidden md:block">
					Hello, {currentUser.display_name}
				</p>
			{/if}
			<div class="login-logout ml-8">
				{#if !isLoggedIn || expiredToken}
					<a href="/api/auth/login">Login</a>
				{:else}
					<a href="/api/auth/logout" class="button">
						<Icon class="hover:text-green-400" src={Logout} size="24" />
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.logo-group:hover {
		color: #0ff770;
	}
	.logo-name {
		line-height: 0px;
	}
</style>
