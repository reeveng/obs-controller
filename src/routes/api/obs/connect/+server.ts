import { connect } from '$lib/obs/obs';
import { json } from '@sveltejs/kit';

export async function POST() {
	const status = await connect();
	return json(status);
}
