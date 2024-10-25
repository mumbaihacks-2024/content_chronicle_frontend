<script>
	// @ts-ignore
	import { events_store } from '$lib/stores/workspaces';
</script>

<div class="min-h-screen bg-gray-100 p-6">
	<div class="relative border-l-4 border-gray-300 space-y-10 ml-10">
		{#each $events_store as item (item.id)}
			<div class="relative flex items-start transition-transform duration-300 transform hover:scale-105">
				<!-- Marker for each event -->
				<div class="absolute -left-10 top-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-md">
					{new Date(item.schedule_time).getDate()}
				</div>
				
				<!-- Event Content -->
				<div class="ml-8 p-5 rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl w-full">
					<div class="flex items-center justify-between">
						<div class="text-gray-600 text-sm">
							{new Date(item.schedule_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', year: 'numeric' })}
							<span class="block text-gray-500">
								{new Date(item.schedule_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
							</span>
						</div>
						<span
							class={`rounded-full px-3 py-1 text-xs font-medium transition duration-200 ease-in-out ${item.is_completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
						>
							{item.is_completed ? 'Completed' : 'Scheduled'}
						</span>
					</div>
					<h2 class="mt-2 text-lg font-semibold text-gray-800">{item.post_text || 'No Title'}</h2>
					<p class="mt-1 text-gray-700">{item.description || 'No description provided.'}</p>
					{#if item.user_notes}
						<p class="mt-2 italic text-sm text-gray-500">Note: {item.user_notes}</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Additional styles for the timeline */
	.timeline-marker {
		background-color: #2563eb; /* Tailwind blue-600 */
	}

	.timeline-event {
		border-radius: 0.5rem; /* Rounded corners */
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	.timeline-event:hover {
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
	}
</style>
