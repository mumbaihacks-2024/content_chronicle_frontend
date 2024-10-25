import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { writable } from 'svelte/store';

export const workspaces_store = writable([]);
export const events_store = writable([]);
export const selected_workspace = writable(null);
// [
    // {
        // "id": 19,
        // "members": [
            // {
                // "id": 17,
                // "password": "pbkdf2_sha256$870000$EuYLxITKD0McwGsdYkbdiW$iLDrY/+uzz9mfvZ7x4cizO5f9TDcz441ZTMASMJN/r4=",
                // "last_login": null,
                // "is_superuser": false,
                // "first_name": "",
                // "last_name": "",
                // "is_staff": false,
                // "is_active": true,
                // "date_joined": "2024-10-25T17:18:38.882143Z",
                // "email": "name004@gmail.com",
                // "username": "name004",
                // "role": null,
                // "groups": [],
                // "user_permissions": []
            // }
        // ],
        // "created_at": "2024-10-25T17:18:39.192604Z",
        // "updated_at": "2024-10-25T17:18:39.192613Z",
        // "name": "Default Workspace",
        // "industry": null,
        // "description": null,
        // "owner": 17
    // }
// ]
// 
export async function update_workspace_store(token) {
    try {
		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/workspace/`, {
			headers: {
				"Authorization": `Token ${token}`
			}
		});
		const data = await response.json();
		workspaces_store.set(data);
		selected_workspace.set(data?.[0]?.id || null);
	} catch (e) {
		console.error(e);
	}
}


export async function fetch_user_events(token, workspace_id) {
    try {
        const response = await fetch(`${PUBLIC_BACKEND_URL}/api/workspace/${workspace_id}/posts/`, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"

            }
        })
        const data = await response.json();
        console.log("initial data", data)
        events_store.set(data);
    } catch (e) {
        console.error(e);
    }
}

export async function generate_user_envents(token, body, workspace_id){
    const response = await fetch(`${PUBLIC_BACKEND_URL}/api/workspace/${workspace_id}/generate-posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`   
        },
        body: JSON.stringify(body)
    })
    const data = await response.json();
    console.log(data, "data")
    events_store.set(data);
}