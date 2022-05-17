<script context="module">
	export async function load({ url, fetch, session }) {
		let access_token = url.searchParams.get('access_token');
		let refresh_token = url.searchParams.get('refresh_token');

		if (!refresh_token) {
			return {
				status: 302,
				redirect: '/',
				message: 'No refresh token'
			};
		}

		const data = await fetch(
			`/api/auth/refresh-token?access_token=${access_token}&refresh_token=${refresh_token}`,
			{
				method: 'GET'
			}
		);

		const res = await data.json();

		if (session.authenticated || res.access_token) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {
			props: {
				session: session
			}
		};
	}
</script>

<script>
	export let session = null;
</script>

{#if !session?.authenticated}
	could not refresh token
{/if}
