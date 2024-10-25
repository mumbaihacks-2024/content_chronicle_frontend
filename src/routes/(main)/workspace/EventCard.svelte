<script>
  import { createEventDispatcher } from 'svelte';

  // @ts-ignore
  export let event;

  const dispatch = createEventDispatcher();

  let isEditing = false;
  let isRegenerating = false;

  let editedTitle = event.post_text;
  let editedSchedule = event.schedule_time;
  let editedDescription = event.description;

  function beautifyDate(dateString) {
  const date = new Date(dateString);

  const options = {
    month: 'short',     // e.g., "Oct"
    day: 'numeric',     // e.g., "26"
    year: '2-digit',    // e.g., "24"
    hour: 'numeric',    // e.g., "3"
    minute: '2-digit',  // e.g., "54"
    hour12: true        // e.g., "AM/PM" format
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Output: "Oct 26, 24, 3:54 AM"


  // @ts-ignore
  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  function handleRegenerate() {
    if (isRegenerating) {
      dispatch('regenerate', { 
        eventId: event.id, 
        newDescription: editedDescription 
      });
    }
    isRegenerating = !isRegenerating;
    isEditing = false;
  }

  function handleEdit() {
    if (isEditing) {
      dispatch('edit', { 
        eventId: event.id, 
        newTitle: editedTitle,
        newSchedule: editedSchedule,
        newDescription: editedDescription
      });
    }
    isEditing = !isEditing;
    isRegenerating = false;
  }

  function handleCancel() {
    isEditing = false;
    isRegenerating = false;
    editedTitle = event.post_text;
    editedSchedule = event.schedule_time;
    editedDescription = event.description;
  }

  function handleDelete() {
    dispatch('delete', { eventId: event.id });
  }
</script>

<div class="bg-white rounded-lg shadow-lg overflow-hidden w-full my-4 border border-gray-300">
  <div class="flex">
    <!-- Content Section -->
    <div class="w-full p-6 space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div>
          {#if isEditing}
            <input
              type="text"
              bind:value={editedTitle}
              class="text-xl font-semibold text-gray-800 mb-2 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter title"
            />
          {:else}
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {event.post_text || 'Untitled Post'}
            </h3>
          {/if}
          <p class="text-sm text-gray-600">ID: {event.id}</p>
        </div>
        <div class="flex space-x-2">
          <span class={`px-3 py-1 rounded-full text-sm ${event.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {event.is_completed ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>

      <!-- Timestamps -->
      <div class="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
        <div>
          <p><span class="font-medium">Created:</span> {beautifyDate(event.created_at)}</p>
          {#if isEditing}
            <label for="schedule" class="font-medium block mt-1">Schedule:</label>
            <input
              type="datetime-local"
              bind:value={editedSchedule}
              class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          {:else}
            <p><span class="font-medium">Schedule:</span> {beautifyDate(event.schedule_time)}</p>
          {/if}
        </div>
        <div>
          <p><span class="font-medium">Updated:</span> {beautifyDate(event.updated_at)}</p>
          {#if event.completed_at}
            <p><span class="font-medium">Completed:</span> {beautifyDate(event.completed_at)}</p>
          {/if}
        </div>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
        {#if isEditing || isRegenerating}
          <textarea
            id="description"
            bind:value={editedDescription}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
          ></textarea>
        {:else}
          <p class="text-gray-600">{event.description}</p>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
        {#if isRegenerating}
          <button
            on:click={handleRegenerate}
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
          <button
            on:click={handleCancel}
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        {:else if isEditing}
          <button
            on:click={handleEdit}
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Save
          </button>
          <button
            on:click={handleCancel}
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        {:else}
          <button
            on:click={handleRegenerate}
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Regenerate
          </button>
          <button
            on:click={handleEdit}
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Edit
          </button>
        {/if}
        <button
          on:click={handleDelete}
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</div>
