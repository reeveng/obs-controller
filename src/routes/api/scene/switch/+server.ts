import { switchScene } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { sceneName } = await request.json();
	const result = await switchScene(sceneName);
	return json(result);
}
