import { getScenes } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function GET() {
	const response = await getScenes();
	return json(response);
}
