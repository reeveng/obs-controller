<script lang="ts">
	import { apiUrls } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import { httpMethod } from '$lib/http-methods';

	let isConnected = $state(false);

	async function connect() {
		console.log('hi');
		const { connected } = await fetch(apiUrls.OBS_CONNECT, { method: httpMethod.POST }).then(
			(res) => res.json()
		);
		console.log({ connected });
		isConnected = connected;
	}

	async function disconnect() {
		const { connected } = await fetch(apiUrls.OBS_DISCONNECT, { method: httpMethod.POST }).then(
			(res) => res.json()
		);
		isConnected = connected;
	}
</script>

<main
	class="container mx-auto flex w-full flex-col gap-4 p-2 py-4 md:gap-8 md:py-8 lg:gap-12 xl:py-12"
>
	<h1 class="text-2xl">Encuez</h1>

	<fieldset class="space-y-4">
		<legend>Connection Status</legend>

		<Button class="block" onclick={connect} disabled={isConnected}>Connect to OBS</Button>
		<Button class="block" onclick={disconnect} disabled={!isConnected}>Disconnect from OBS</Button>

		<p role="status" aria-live="assertive" aria-atomic="true" class="sr-only">
			Status: {isConnected ? 'Connected' : 'Disconnected'}
		</p>
	</fieldset>
</main>
