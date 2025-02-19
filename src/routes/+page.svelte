<script lang="ts">
	import { apiUrls } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { httpMethod } from '$lib/http-methods';
	import { scenes } from '$lib/stores/scenes';
	import { cn } from '$lib/utils';

	let isConnected = $state(false);
	let isRecording = $state(false);

	async function connect() {
		try {
			const { connected } = await fetch(apiUrls.OBS_CONNECT, { method: httpMethod.POST }).then(
				(res) => res.json()
			);

			isConnected = connected;
		} catch (error) {
			console.error('Auto-connect failed:', error);
		}
	}

	async function disconnect() {
		try {
			const { connected } = await fetch(apiUrls.OBS_DISCONNECT, { method: httpMethod.POST }).then(
				(res) => res.json()
			);

			isConnected = connected;
		} catch (error) {
			console.error('disconnect failed:', error);
		}
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

	async function fetchScenes() {
		const response = await fetch(apiUrls.OBS_SCENES);
		const { scenes: sceneList, current } = await response.json();
		$scenes = { scenes: sceneList, current };
	}

	async function switchScene(sceneName: string) {
		await fetch(apiUrls.OBS_SWITCH_SCENE, {
			method: httpMethod.POST,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sceneName })
		}).then((res) => res.json());
	}

	async function fetchRecordingStatus() {
		try {
			const status = await fetch(apiUrls.OBS_RECORDING_STATUS).then((res) => res.json());

			isRecording = status.recording;
		} catch (error) {
			console.error('Status polling error:', error);
		}
	}

	$effect(() => {
		const interval = setInterval(async () => {
			if (!isConnected) {
				return;
			}

			fetchRecordingStatus();
			fetchScenes();
		}, 5000);

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
			<Button onclick={connect}>Try to connect to OBS</Button>
		{:else}
			<!-- <Button onclick={disconnect}>Disconnect from OBS</Button> -->
		{/if}
	</section>

	{#if isConnected}
		<section class="flex flex-col gap-4 rounded-md border p-8">
			<h2 class="text-lg font-semibold">Recording management</h2>

			<Button onclick={startRecording} disabled={isRecording} aria-label="Start recording">
				Start Recording
			</Button>

			<Button onclick={stopRecording} disabled={!isRecording} aria-label="Stop recording">
				Stop Recording
			</Button>
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
