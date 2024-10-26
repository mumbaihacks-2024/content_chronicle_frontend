<script lang="js">
	import * as Tabs from '$lib/components/ui/tabs';
	import { events_store } from '$lib/stores/workspaces';
	import EventCard from './EventCard.svelte';
	import CalendarView from './CalendarView.svelte';
	import {
		update_user_generated_event,
		update_user_prompt_for_image,
		delete_user_prompt_for_image,
		ai_image_from_prompt
	} from '$lib/stores/workspaces';

	export let current_workspace_id = '';
	export let token = '';

	let curr_value = 'list';

	function handleEdit(event) {
		const data = event.detail;
		update_user_generated_event(token, current_workspace_id, data);
	}

	function handlePromptUpdate(event) {
		const data = event.detail;
		update_user_prompt_for_image(token, current_workspace_id, data);
	}
	
	function handleImageGeneration(event) {
		const data = event.detail;
		ai_image_from_prompt(token, current_workspace_id, data);
	}
	function handleDelete(event) {
		const data = event.detail;
		delete_user_prompt_for_image(token, current_workspace_id, data);
	}

</script>

<div class="mx-auto w-full max-w-[90%]">
	<Tabs.Root bind:value={curr_value} class="mx-auto  rounded-lg  p-6 ">
		<Tabs.List class="flex border-b-2 border-gray-300">
			<Tabs.Trigger
				value="list"
				on:click={() => (curr_value = 'list')}
				class="flex-1 border-b-4 border-transparent px-6 py-3 text-center text-lg font-medium text-gray-600 transition duration-200 "
			>
				List View
			</Tabs.Trigger>
			<Tabs.Trigger
				value="calendar"
				on:click={() => (curr_value = 'calendar')}
				class="flex-1 border-b-4 border-transparent px-6 py-3 text-center text-lg font-medium text-gray-600 transition duration-200 "
			>
				Timeline View
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content
			value="list"
			class="grid gap-6 rounded-b-lg bg-gray-50 p-8 text-gray-700 lg:grid-cols-2"
		>
			{#if curr_value === 'list'}
				{#each $events_store as event}
					<EventCard
						{event}
						on:edit={handleEdit}
						on:regenerate={handlePromptUpdate}
						on:delete={handleDelete}
						on:generate_image={handleImageGeneration}
					/>
				{/each}
			{/if}
		</Tabs.Content>
		<Tabs.Content value="calendar" class="rounded-b-lg bg-gray-50 p-8 text-gray-700">
			<CalendarView />
		</Tabs.Content>
	</Tabs.Root>
</div>
