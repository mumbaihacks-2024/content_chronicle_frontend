<script lang="js">
	import * as Tabs from '$lib/components/ui/tabs';
	import { events_store } from '$lib/stores/workspaces';
	import EventCard from './EventCard.svelte';
	import CalendarView from './CalendarView.svelte';
</script>

<div class="mx-auto w-full max-w-[90%]">
	<Tabs.Root value="list" class="mx-auto  rounded-lg  p-6 ">
		<Tabs.List class="flex border-b-2 border-gray-300">
			<Tabs.Trigger
				value="list"
				class="flex-1 border-b-4 border-transparent px-6 py-3 text-center text-lg font-medium text-gray-600 transition duration-200 "
			>
				List View
			</Tabs.Trigger>
			<Tabs.Trigger
				value="calendar"
				class="flex-1 border-b-4 border-transparent px-6 py-3 text-center text-lg font-medium text-gray-600 transition duration-200 "
			>
				Timeline View
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="list" class="rounded-b-lg bg-gray-50 p-8 text-gray-700 ">
			{#each $events_store as event}
				<EventCard {event} />
			{/each}
		</Tabs.Content>
		<Tabs.Content value="calendar" class="rounded-b-lg bg-gray-50 p-8 text-gray-700">
			<!-- @ts-ignore -->
			<CalendarView />
		</Tabs.Content>
	</Tabs.Root>
</div>
