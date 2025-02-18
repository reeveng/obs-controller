import { startRecording } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function POST() {
	const result = await startRecording();
	return json(result);
}
