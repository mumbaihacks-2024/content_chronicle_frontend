<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import { createEventDispatcher } from 'svelte';

    let workspaceName = '';
    let open = false;
    const dispatch = createEventDispatcher();

    function createWorkspace() {
        if (workspaceName.trim()) {
            dispatch('create', { workspaceName });
            workspaceName = ''; 
            open = false;
        }
    }
</script>

<Dialog.Root bind:open={open}>
    <Dialog.Trigger>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Workspace
        </button>
    </Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title class="text-lg font-semibold">Create New Workspace</Dialog.Title>
            <Dialog.Description class="text-gray-600">
                Please enter a name for your new workspace.
            </Dialog.Description>
        </Dialog.Header>

        <div class="mt-4">
            <input
                type="text"
                bind:value={workspaceName}
                placeholder="Workspace name"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div class="mt-6 flex justify-end space-x-2">
            <button on:click={() => open = false} class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
            </button>
            <button on:click={createWorkspace} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create
            </button>
        </div>
    </Dialog.Content>
</Dialog.Root>
