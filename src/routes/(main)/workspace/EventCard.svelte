<script>
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	// @ts-ignore
	export let event;

	const dispatch = createEventDispatcher();

	let isEditing = false;
	let isRegenerating = false;

	let editedTitle = event.post_text;
	let editedSchedule = event.schedule_time;
	let editedDescription = event.description;

	function removeUrlFromString(str) {
		const urlPattern = /http:\/\/localhost:8000\/?/g;
		return str.replace(urlPattern, '');
	}

	const handleDownload = () => {
		const url = removeUrlFromString(`${PUBLIC_BACKEND_URL}/${event.post_image}`);
		const link = document.createElement('a');
		link.href = url;
		link.download = ''; // Specify the filename if needed
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	function beautifyDate(dateString) {
		const date = new Date(dateString);

		const options = {
			month: 'short', // e.g., "Oct"
			day: 'numeric', // e.g., "26"
			year: '2-digit', // e.g., "24"
			hour: 'numeric', // e.g., "3"
			minute: '2-digit', // e.g., "54"
			hour12: true // e.g., "AM/PM" format
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

	function handleGenerateImage() {
		dispatch('generate_image', {
			eventId: event.id,
			prompt: event.description
		});
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

<div class="my-4 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
	<div class="flex">
		<!-- Content Section -->
		<div class="w-full space-y-6 p-6">
			<!-- Header -->
			<div class="mb-4 flex items-start justify-between">
				<div>
					{#if isEditing}
						<input
							type="text"
							bind:value={editedTitle}
							class="mb-2 w-full rounded-lg border border-gray-300 p-2 text-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="Enter title"
						/>
					{:else}
						<h3 class="mb-2 text-xl font-semibold text-gray-800">
							{event.post_text || 'Untitled Post'}
						</h3>
					{/if}
					<p class="text-sm text-gray-600">ID: {event.id}</p>
				</div>
				<div class="flex space-x-2">
					<span
						class={`rounded-full px-3 py-1 text-sm ${event.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
					>
						{event.is_completed ? 'Completed' : 'Pending'}
					</span>
				</div>
			</div>

			<!-- Timestamps -->
			<div class="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
				<div>
					<p><span class="font-medium">Created:</span> {beautifyDate(event.created_at)}</p>
					{#if isEditing}
						<label for="schedule" class="mt-1 block font-medium">Schedule:</label>
						<input
							type="datetime-local"
							bind:value={editedSchedule}
							class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
				<label for="description" class="mb-2 block text-sm font-medium text-gray-700"
					>Description</label
				>
				{#if isEditing || isRegenerating}
					<textarea
						id="description"
						bind:value={editedDescription}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						rows="3"
					></textarea>
				{:else}
					<p class="text-gray-600">{event.description}</p>
				{/if}
			</div>

			<!-- Action Buttons -->
			<div class="relative flex space-x-3 bg-slate-100 p-2">
				{#if isRegenerating}
					<button
						on:click={handleRegenerate}
						class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
					>
						Save
					</button>
					<button
						on:click={handleCancel}
						class="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
					>
						Cancel
					</button>
				{:else if isEditing}
					<button
						on:click={handleEdit}
						class="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
					>
						Save
					</button>
					<button
						on:click={handleCancel}
						class="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
					>
						Cancel
					</button>
				{:else}
					<Button on:click={handleRegenerate} class="bg-green-800">Regenerate</Button>
					<Button on:click={handleEdit} class="bg-blue-800">Edit</Button>
				{/if}
				<Button on:click={handleDelete} class="bg-red-600">Delete</Button>
				{#if event?.post_image}
					<a href="#" on:click={handleDownload} role="button">
						<button class="button absolute right-0 mt-[-5px]" style="vertical-align:middle">
							<span>Download</span>
						</button>
					</a>
				{:else}
					<div
						class="absolute right-0 mt-[-5px]"
						on:click={handleGenerateImage}
						on:keydown={(e) => e.key === 'Enter' && handleGenerateImage()}
						role="button"
						tabindex="0"
					>
						<button class="btn">
							<svg
								height="24"
								width="24"
								fill="#FFFFFF"
								viewBox="0 0 24 24"
								data-name="Layer 1"
								id="Layer_1"
								class="sparkle"
							>
								<path
									d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"
								></path>
							</svg>

							<span class="text">Generate</span>
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
