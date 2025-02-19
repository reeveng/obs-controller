import { getConnectionStatus } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function GET() {
	const status = await getConnectionStatus();
	return json(status);
}
