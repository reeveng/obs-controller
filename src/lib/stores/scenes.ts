import { writable } from 'svelte/store';

interface SceneStore {
	scenes: string[];
	current: string;
}

export const scenes = writable<SceneStore>({
	scenes: [],
	current: ''
});
