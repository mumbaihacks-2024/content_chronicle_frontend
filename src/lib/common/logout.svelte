<script>
	import { goto } from "$app/navigation";

	async function logout() {
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('Logout failed');
		}else {
            goto('/login');
        }
	}
</script>

<button on:click={logout} class="ml-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
	Logout
</button>
