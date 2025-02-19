import OBSWebSocket, { type OBSResponseTypes } from 'obs-websocket-js';
import { OBS_WEB_SOCKET_URL, OBS_WEB_SOCKET_PASSWORD } from '$env/static/private';

const obs = new OBSWebSocket();

function handleError(error: unknown, action: string) {
	console.error(`Error during ${action}:`, error);
	return error instanceof Error ? error.message : 'Unknown error';
}

export async function connect() {
	try {
		await obs.connect(OBS_WEB_SOCKET_URL ?? 'ws://localhost:4455', OBS_WEB_SOCKET_PASSWORD ?? '');

		return { connected: true };
	} catch (error) {
		return { connected: false, error: handleError(error, 'connect') };
	}
}

export async function disconnect() {
	try {
		await obs.disconnect();

		return { connected: false };
	} catch (error) {
		return { connected: true, error: handleError(error, 'disconnect') };
	}
}

export async function startRecording() {
	try {
		await obs.call('StartRecord');

		return { recording: true, success: true };
	} catch (error) {
		return {
			recording: null,
			success: false,
			error: handleError(error, 'start recording')
		};
	}
}

export async function stopRecording() {
	try {
		const { outputPath } = await obs.call('StopRecord');

		return { recording: false, success: true, filePath: outputPath };
	} catch (error) {
		return {
			recording: null,
			success: false,
			error: handleError(error, 'stop recording')
		};
	}
}

export async function getRecordingStatus() {
	try {
		const status = await obs.call('GetRecordStatus');
		const { recordDirectory } = await obs.call('GetRecordDirectory');

		const { outputActive, outputTimecode } = status;

		return {
			recording: outputActive,
			success: true,
			timecode: outputTimecode,
			directory: recordDirectory
		};
	} catch (error) {
		return { recording: null, success: false, error: handleError(error, 'get recording status') };
	}
}

export async function getScenes() {
	try {
		const response: OBSResponseTypes['GetSceneList'] = await obs.call('GetSceneList');
		const currentScene = await getCurrentScene();

		const scenes = response.scenes.map((scene) => scene.sceneName).sort();

		return {
			scenes,
			current: currentScene,
			success: true
		};
	} catch (error) {
		return { scenes: [], current: '', success: false, error: handleError(error, 'get scenes') };
	}
}

export async function switchScene(sceneName: string) {
	try {
		await obs.call('SetCurrentProgramScene', { sceneName });

		return { success: true, currentScene: sceneName };
	} catch (error) {
		return { success: false, currentScene: '', error: handleError(error, 'switch scene') };
	}
}

export async function getCurrentScene() {
	try {
		const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');

		return currentProgramSceneName ?? '';
	} catch (error) {
		return handleError(error, 'get current scene');
	}
}

export async function getConnectionStatus() {
	try {
		const { obsVersion } = await obs.call('GetVersion');

		return { isConnected: Boolean(obsVersion) };
	} catch {
		return { isConnected: false };
	}
}
