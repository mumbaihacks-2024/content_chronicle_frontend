<script>
	import { goto } from "$app/navigation";
    import { loader } from "$lib/stores/loader";
    let email = '';
    let password = '';
    

    async function login() {
        
        try {
            loader.set(true);
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                goto('/workspace');
            } else {
                console.error(data.message);
            }
        } catch (e) {
            console.log(`Error: ${e}`);
        } finally {
            loader.set(false);
        }
    }
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 class="mb-6 text-center text-2xl font-semibold">Login to Your Account</h2>
        <form on:submit|preventDefault={login} class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    required
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    required
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
            </div>
            <button
                type="submit"
                class="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Login
            </button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a href="/register" class="text-blue-600 hover:underline">Register here</a>
        </p>
    </div>
</div>
