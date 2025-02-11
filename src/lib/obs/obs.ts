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
