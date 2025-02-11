import { disconnect } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function POST() {
	const status = await disconnect();
	return json(status);
}
