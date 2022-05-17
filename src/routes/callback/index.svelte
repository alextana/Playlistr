<script context="module">
	export async function load({ url, fetch, session }) {
		let code = url.searchParams.get('code');
		let state = url.searchParams.get('state');

		const data = await fetch(`/api/auth/callback?code=${code}&state=${state}`, {
			method: 'POST'
		});

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
	could not login
{/if}
