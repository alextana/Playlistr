<script>
	import SocialLinks from '../ui/social_links/SocialLinks.svelte';
	export let isMobile;
</script>

<div class="{isMobile ? 'mobile-margin' : ''} footer-container mt-8 py-8">
	<div class="text-center text-xs text-white">Playlistr for Spotify, built in SvelteKit</div>
	<div class="links flex justify-center mt-2">
		<SocialLinks />
	</div>
</div>

<style>
	.mobile-margin {
		margin-bottom: 40px;
	}
</style>
