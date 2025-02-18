<script lang="ts">
	import { apiUrls } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import { httpMethod } from '$lib/http-methods';

	let isConnected = $state(false);
	let isRecording = $state(false);

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

	async function startRecording() {
		const { success, recording } = await fetch(apiUrls.OBS_START_RECORDING, {
			method: httpMethod.POST
		}).then((res) => res.json());

		if (success) {
			isRecording = recording;
		}
	}

	async function stopRecording() {
		const { success, recording } = await fetch(apiUrls.OBS_STOP_RECORDING, {
			method: httpMethod.POST
		}).then((res) => res.json());

		if (success) {
			isRecording = recording;
		}
	}

	$effect(() => {
		const interval = setInterval(async () => {
			try {
				const status = await fetch(apiUrls.OBS_RECORDING_STATUS).then((res) => res.json());
				isRecording = status.recording;
			} catch (error) {
				console.error('Status polling error:', error);
			}
		}, 5000);

		return () => clearInterval(interval);
	});
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

	<fieldset>
		<legend>Recording Status</legend>

		<Button
			onclick={startRecording}
			disabled={isRecording}
			aria-pressed={isRecording ? 'true' : 'false'}
			aria-label="Start recording"
		>
			Start Recording
		</Button>

		<Button
			onclick={stopRecording}
			disabled={!isRecording}
			aria-pressed={isRecording ? 'false' : 'true'}
			aria-label="Stop recording"
		>
			Stop Recording
		</Button>

		<div role="status" aria-live="assertive" aria-atomic="true">
			<p>
				Recording: {isRecording ? 'In Progress' : 'Not Recording'}
			</p>
		</div>
	</fieldset>
</main>
