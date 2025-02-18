import { stopRecording } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function POST() {
	const result = await stopRecording();
	return json(result);
}
