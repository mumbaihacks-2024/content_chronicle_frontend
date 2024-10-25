<script>
    import Logout from "$lib/common/logout.svelte";
    
    import { update_workspace_store , workspaces_store, selected_workspace} from "$lib/stores/workspaces";
	import { onMount } from "svelte";

    export let data;

    function createWorkspace() {
        alert('Creating a new workspace...');
    }

    $: {console.log($workspaces_store, "look")}

    onMount(() => {
        update_workspace_store(data.user.token);
    })
</script>

<div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
        <div class="flex items-center justify-center h-16 bg-blue-600 text-white">
            <h1 class="text-lg font-bold">My Logo</h1>
        </div>
        <nav class="mt-6">
            <ul class="space-y-2">
                <li>
                    <a href="/workspace" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">Workspace</a>
                </li>
                <li>
                    <a href="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">Profile</a>
                </li>
            </ul>
        </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <header class="flex items-center justify-between h-16 bg-white shadow-md px-4">
            <div>
                <select bind:value={$selected_workspace} class="border border-gray-300 rounded-md p-2">
                    <option >Select Workspace</option>
                    {#each $workspaces_store as workspace}
                        <option value={workspace.id}>{workspace.name}</option>
                    {/each}
                </select>
                <button on:click={createWorkspace} class="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Create Workspace
                </button>
            </div>
           <Logout/>
        </header>

        <!-- Content Area -->
        <main class="flex-1 p-6">
            <h2 class="text-2xl font-bold">Content Area</h2>
            <p class="mt-2 text-gray-600">This is where your main content will go.</p>
        </main>
    </div>
</div>

<style>
    /* Custom styles (if needed) */
</style>
