<script lang="ts">
	import { apiUrls } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { fetchWithErrorHandling } from '$lib/fetch-with-error-handling';
	import { httpMethod } from '$lib/http-methods';
	import { scenes } from '$lib/stores/scenes';
	import { cn } from '$lib/utils';

	let isConnected = $state(false);
	let isRecording = $state(false);
	let timecode = $state();
	let fileLocation = $state();
	let fileDirectory = $state();

	async function connect() {
		const { connected } = await fetchWithErrorHandling(apiUrls.OBS_CONNECT, {
			method: httpMethod.POST
		});

		isConnected = connected;
	}

	async function disconnect() {
		const { connected } = await fetchWithErrorHandling(apiUrls.OBS_DISCONNECT, {
			method: httpMethod.POST
		});

		isConnected = connected;
	}

	async function startRecording() {
		const { success, recording } = await fetchWithErrorHandling(apiUrls.OBS_START_RECORDING, {
			method: httpMethod.POST
		});

		if (success) {
			fileLocation = undefined;
			isRecording = recording;
		}
	}

	async function stopRecording() {
		const { success, recording, filePath } = await fetchWithErrorHandling(
			apiUrls.OBS_STOP_RECORDING,
			{
				method: httpMethod.POST
			}
		);

		if (success) {
			fileLocation = filePath;
			isRecording = recording;
		}
	}

	async function fetchScenes() {
		const { scenes: sceneList, current } = await fetchWithErrorHandling(apiUrls.OBS_SCENES);
		$scenes = { scenes: sceneList, current };
	}

	async function switchScene(sceneName: string) {
		fetchWithErrorHandling(apiUrls.OBS_SWITCH_SCENE, {
			method: httpMethod.POST,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sceneName })
		});
	}

	async function fetchRecordingStatus() {
		const status = await fetchWithErrorHandling(apiUrls.OBS_RECORDING_STATUS);

		timecode = status.timecode;
		isRecording = status.recording;
		fileDirectory = status.directory;
	}

	async function fetchConnectionStatus() {
		const status = await fetchWithErrorHandling(apiUrls.OBS_STATUS);
		isConnected = status.isConnected;

		return status.isConnected;
	}

	$effect(() => {
		const interval = setInterval(async () => {
			const isConnected = await fetchConnectionStatus();

			if (!isConnected) {
				return;
			}

			await fetchRecordingStatus();
			await fetchScenes();
		}, 500);

		return () => clearInterval(interval);
	});

	$effect(() => {
		if (isConnected) {
			fetchScenes();
		}
	});

	$effect(() => {
		if (isConnected && $scenes.current) {
			switchScene($scenes.current);
		}
	});

	// attempt to connect on start of application
	$effect(() => {
		connect();

		return () => {
			disconnect();
		};
	});
</script>

<main class="container mx-auto flex w-full flex-col gap-8 p-8 py-4 md:py-8 lg:gap-12 xl:py-12">
	<div class="mb-8 flex items-center justify-center">
		<h1 class="w-full text-4xl">Encuez</h1>

		{#if isConnected}
			<button
				class={cn(
					'ml-auto h-6 w-6 rounded-full border-2 border-stone-950 hover:border-white',
					isRecording ? 'bg-red-700 hover:bg-red-400' : 'bg-gray-700 hover:bg-gray-400'
				)}
				onclick={isRecording ? stopRecording : startRecording}
			>
				<span class="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
			</button>
		{/if}
	</div>

	<section
		role="status"
		aria-live="polite"
		aria-atomic="true"
		class="flex flex-col gap-4 rounded-md border p-8"
	>
		<div class="flex items-center justify-center">
			<h2 class="text-lg font-semibold">Connection Status</h2>
			<p
				class={cn(
					'ml-auto h-6 w-6 rounded-full border-2 border-stone-200',
					isConnected ? 'bg-green-700' : 'bg-red-700'
				)}
			>
				<span class="sr-only">{isConnected ? 'Connected' : 'Disconnected'}</span>
			</p>
		</div>

		{#if !isConnected}
			<Button onclick={connect}>Try to connect with OBS</Button>
		{:else}
			<!-- <Button onclick={disconnect}>Disconnect from OBS</Button> -->
		{/if}
	</section>

	{#if isConnected}
		<section class="flex flex-col gap-4 rounded-md border p-8">
			<h2 class="text-lg font-semibold">Recording management</h2>

			{#if isRecording}
				<p>Timecode: {timecode}</p>
				<p>Directory file will be saved to: {fileDirectory}</p>
			{:else if fileLocation}
				<p>File saved to: {fileLocation}</p>
			{/if}

			<Button onclick={startRecording} disabled={isRecording}>Start Recording</Button>

			<Button onclick={stopRecording} disabled={!isRecording}>Stop Recording</Button>
		</section>

		<section class="flex flex-col gap-4 rounded-md border p-8">
			<h2 class="text-lg font-semibold">Scene Management</h2>

			<label for="scene" class="sr-only">Scene</label>
			<Select.Root type="single" bind:value={$scenes.current} name="scene">
				<Select.Trigger>
					{$scenes.current ? $scenes.current : 'Select a scene'}
				</Select.Trigger>
				<Select.Content class="bg-stone-950">
					{#each $scenes.scenes as scene}
						<Select.Item value={scene} label={scene} />
					{/each}
				</Select.Content>
			</Select.Root>
		</section>
	{/if}
</main>
