import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

export async function connect() {
	try {
		await obs.connect(
			import.meta.env.VITE_OBS_WEB_SOCKET_URL ?? 'ws://localhost:4455',
			import.meta.env.VITE_OBS_WEB_SOCKET_PASSWORD ?? ''
		);
		return { connected: true };
	} catch (error) {
		console.log('error happened while trying to connect', error);
		return { connected: false };
	}
}

export async function disconnect() {
	try {
		await obs.disconnect();
		return { connected: false };
	} catch (error) {
		console.log('error happened while trying to disconnect', error);
		return { connected: true, error };
	}
}

export async function startRecording() {
	try {
		await obs.call('StartRecord');
		return { recording: true, success: true };
	} catch (error) {
		console.error('Error starting recording:', error);
		return {
			recording: false,
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

export async function stopRecording() {
	try {
		await obs.call('StopRecord');
		return { recording: false, success: true };
	} catch (error) {
		console.error('Error stopping recording:', error);
		return {
			recording: true,
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

export async function getRecordingStatus() {
	try {
		const { outputActive } = await obs.call('GetRecordStatus');
		return { recording: outputActive, success: true };
	} catch (error) {
		console.error('Error getting recording status:', error);
		return { recording: false, success: false };
	}
}
