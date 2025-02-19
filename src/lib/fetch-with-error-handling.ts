export async function fetchWithErrorHandling(url: string, options?: RequestInit) {
	try {
		const res = await fetch(url, options);
		if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
		return await res.json();
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}
