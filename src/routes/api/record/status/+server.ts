import { getRecordingStatus } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function GET() {
	const status = await getRecordingStatus();
	return json(status);
}
