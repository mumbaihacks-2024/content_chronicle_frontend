<script>
  import { createEventDispatcher } from 'svelte';
  
  // @ts-ignore
  export let event;
  
  const dispatch = createEventDispatcher();
  
  let isEditing = false;
  let editedDescription = event.description;
  
// @ts-ignore
  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }
  
  function handleRegenerate() {
    // @ts-ignore
    dispatch('regenerate', { eventId: event.id });
  }
  
  function handleDelete() {
    // @ts-ignore
    dispatch('delete', { eventId: event.id });
  }
  
  function handleEdit() {
    if (isEditing) {
      dispatch('edit', { 
        // @ts-ignore
        eventId: event.id, 
        newDescription: editedDescription 
      });
    }
    isEditing = !isEditing;
  }
</script>

<div class="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl my-4">
  <div class="flex">
    <!-- Image Section -->
    <div class="w-1/3">
      {#if event.post_image}
        <img
          src={event.post_image}
          alt="Post"
          class="w-full h-full object-cover"
        />
      {:else}
        <div class="w-full h-full bg-gray-200 flex items-center justify-center">
          <span class="text-gray-400">No Image</span>
        </div>
      {/if}
    </div>

    <!-- Content Section -->
    <div class="w-2/3 p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            {event.post_text || 'Untitled Post'}
          </h3>
          <p class="text-sm text-gray-600">
            ID: {event.id}
          </p>
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
          <p><span class="font-medium">Created:</span> {formatDate(event.created_at)}</p>
          <p><span class="font-medium">Schedule:</span> {formatDate(event.schedule_time)}</p>
        </div>
        <div>
          <p><span class="font-medium">Updated:</span> {formatDate(event.updated_at)}</p>
          {#if event.completed_at}
            <p><span class="font-medium">Completed:</span> {formatDate(event.completed_at)}</p>
          {/if}
        </div>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
        {#if isEditing}
          <textarea
            id="description"
            bind:value={editedDescription}
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          ></textarea>
        {:else}
          <p class="text-gray-600">{event.description}</p>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
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
          {isEditing ? 'Save' : 'Edit'}
        </button>
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