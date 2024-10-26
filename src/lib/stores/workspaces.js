import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { writable } from 'svelte/store';
import { loader } from './loader';

export const workspaces_store = writable([]);
export const events_store = writable([]);
export const selected_workspace = writable(null);

export async function update_workspace_store(token) {
	try {
        loader.set(true);
		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/workspace/`, {
			headers: {
				Authorization: `Token ${token}`
			}
		});
		const data = await response.json();
		workspaces_store.set(data);
		selected_workspace.set(data?.[0]?.id || null);
	} catch (e) {
		console.error(e);
	} finally {
        loader.set(false);
    }
}

export async function fetch_user_events(token, workspace_id) {
	try {
        loader.set(true);
		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/workspace/${workspace_id}/posts/`, {
			headers: {
				Authorization: `Token ${token}`,
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		events_store.set(data);
	} catch (e) {
		console.error(e);
	} finally {
        loader.set(false);
    }
}

export async function generate_user_envents(token, body, workspace_id) {
	try {
		loader.set(true);
		const response = await fetch(
			`${PUBLIC_BACKEND_URL}/api/workspace/${workspace_id}/generate-posts`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`
				},
				body: JSON.stringify(body)
			}
		);
		const data = await response.json();
		events_store.set(data);
	} catch (e) {
		console.error(e);
	} finally {
		loader.set(false);
	}
}

export async function update_user_generated_event(token, workspace_id, post_data) {
	let selective_data = {
		post_text: post_data.newTitle,
		description: post_data.newDescription,
		schedule_time: post_data.newSchedule
	};
	try {
        loader.set(true);
		const response = await fetch(
			`${PUBLIC_BACKEND_URL}/api/workspace/${workspace_id}/posts/${post_data.eventId}/`,
			{
				headers: {
					Authorization: `Token ${token}`,
					'Content-Type': 'application/json'
				},
				method: 'PUT',
				body: JSON.stringify(selective_data)
			}
		);
		const data = await response.json();
		// events_store.set(data);
	} catch (e) {
		console.error(e);
	} finally {
        loader.set(false);
		fetch_user_events(token, workspace_id);
    }
}

export async function update_user_prompt_for_image(token, workspace_id, prompt) {
	let selective_data = {
		prompt: prompt.newDescription
	};
	try {
        loader.set(true);
		const response = await fetch(
			`${PUBLIC_BACKEND_URL}/api/workspace/${workspace_id}/posts/${prompt.eventId}/regenerate`,
			{
				headers: {
					Authorization: `Token ${token}`,
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(selective_data)
			}
		);
		const data = await response.json();
	} catch (e) {
		console.error(e);
	} finally {
        loader.set(false);
		fetch_user_events(token, workspace_id);
    }
}

export async function delete_user_prompt_for_image(token, workspace_id, prompt) {
	try {
        loader.set(true);
		const response = await fetch(
			`${PUBLIC_BACKEND_URL}/api/workspace/${workspace_id}/posts/${prompt.eventId}/`,
			{
				headers: {
					Authorization: `Token ${token}`,
					'Content-Type': 'application/json'
				},
				method: 'DELETE'
			}
		);
		const data = await response.json();
		fetch_user_events(token, workspace_id);
	} catch (e) {
		console.error(e);
	} finally {
        loader.set(false);
    }
}
