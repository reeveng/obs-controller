import { getScenes } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function GET() {
	const scenes = await getScenes();
	return json(scenes);
}
