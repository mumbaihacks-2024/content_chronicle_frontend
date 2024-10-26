<script lang="js">
	import Logout from '$lib/common/logout.svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import Logo from '$lib/images/logo.svg';
	import RetroGrid from '$lib/common/RetroGrid.svelte';
	import { loader } from '$lib/stores/loader';

	import AddWorkspace from './AddWorkspace.svelte';
	import {
		update_workspace_store,
		workspaces_store,
		selected_workspace,
		generate_user_envents,
		fetch_user_events
	} from '$lib/stores/workspaces';
	import { onMount } from 'svelte';

	import EventsContainer from './EventsContainer.svelte';

	export let data;
	let userPrompt = '';
	// @ts-ignore
	let current_workspace_data;
	let title = '';
	let fromDate = '';
	let toDate = '';

	// @ts-ignore
	const formatDate = (date) => {
		return date ? date.split('T')[0] : '';
	};

	// Function to calculate max date (7 days from from-date)
	// @ts-ignore
	const calculateMaxDate = (fromDateStr) => {
		if (!fromDateStr) return '';
		const date = new Date(fromDateStr);
		date.setDate(date.getDate() + 6);
		return date.toISOString().split('T')[0];
	};

	// Function to calculate min date (7 days before to-date)
	// @ts-ignore
	const calculateMinDate = (toDateStr) => {
		if (!toDateStr) return '';
		const date = new Date(toDateStr);
		date.setDate(date.getDate() - 6);
		return date.toISOString().split('T')[0];
	};

	// Function to check if date range is valid (≤ 7 days)
	// @ts-ignore
	const isValidDateRange = (start, end) => {
		if (!start || !end) return true;
		const startDate = new Date(start);
		const endDate = new Date(end);
		// @ts-ignore
		const diffTime = Math.abs(endDate - startDate);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays < 7;
	};

	onMount(() => {
		update_workspace_store(data.user.token);
	});

	$: {
		const current_workspace = $workspaces_store.find(
			(workspace) => workspace.id === $selected_workspace
		);
		current_workspace_data = current_workspace;
		if (current_workspace) {
			// @ts-ignore
			userPrompt = !!window.localStorage.getItem(`${current_workspace_data?.id}-user_prompt`)
				? window.localStorage.getItem(`${current_workspace_data?.id}-user_prompt`)
				: '';
			// userPrompt = !!current_workspace?.description ? current_workspace?.description : null;
			title = !!current_workspace?.name ? current_workspace?.name : null;
		} else {
			userPrompt = '';
			title = '';
		}
	}

	// @ts-ignore
	function handleFromDateChange(event) {
		const newFromDate = event.target.value;
		if (toDate && !isValidDateRange(newFromDate, toDate)) {
			const maxDate = calculateMaxDate(newFromDate);
			if (toDate > maxDate) {
				toDate = maxDate;
			}
		}
		fromDate = newFromDate;
	}
	// @ts-ignore
	function handleToDateChange(event) {
		const newToDate = event.target.value;
		if (fromDate && !isValidDateRange(fromDate, newToDate)) {
			const minDate = calculateMinDate(newToDate);
			if (fromDate < minDate) {
				fromDate = minDate;
			}
		}
		toDate = newToDate;
	}

	// fetch the initial data when the title changes
	$: if (title) {
		trigger_fetch_user_events();
	}

	function trigger_fetch_user_events() {
		// @ts-ignore
		fetch_user_events(data.user.token, current_workspace_data?.id);
	}

	// @ts-ignore
	async function handleAddWorkSpace(event) {
		try {
			loader.set(true);
			await fetch(`${PUBLIC_BACKEND_URL}/api/workspace/`, {
				method: 'POST',
				body: JSON.stringify({ name: event.detail.workspaceName }),
				headers: {
					Authorization: `Token ${data.user.token}`,
					'Content-Type': 'application/json'
				}
			});
			update_workspace_store(data.user.token);
		} catch (e) {
			console.error(e);
		} finally {
			loader.set(false);
		}
	}

	async function handlDescriptionSubmit() {
		if (userPrompt.length >= 100 && fromDate && toDate) {
			const start = new Date(fromDate);
			const end = new Date(toDate);

			if (end < start) {
				alert('End date must be after start date');
				return;
			}

			if (!isValidDateRange(fromDate, toDate)) {
				alert('Date range cannot exceed 7 days');
				return;
			}

			const reuest_body = {
				range_start: fromDate.toString(),
				range_end: toDate.toString(),
				custom_instructions: userPrompt
			};

			// @ts-ignore
			generate_user_envents(data.user.token, reuest_body, current_workspace_data?.id);
			if (typeof window !== 'undefined') {
				// @ts-ignore
				window.localStorage.setItem(`${current_workspace_data?.id}-user_prompt`, userPrompt);
			}
		} else {
			alert('Please fill in all required fields (prompt min 100 characters and both dates).');
		}
	}
</script>

<div class="relative flex h-screen overflow-hidden bg-gray-100">
	<RetroGrid/>
	<div class="absolute left-5 top-5">
		<img src={Logo} alt="logo" class="mx-auto  block h-[80px]" />
	</div>
	<header class="flex h-16 flex-shrink-0 items-center justify-between  px-4  absolute right-5 top-5">
		<div class="flex gap-3">
			<select bind:value={$selected_workspace} class="rounded-md border p-2">
				<option>Select Workspace</option>
				{#each $workspaces_store as workspace}
					<option value={workspace.id}>{workspace.name}</option>
				{/each}
			</select>
			<AddWorkspace on:create={handleAddWorkSpace} />
		</div>
		<Logout />
	</header>
	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden mt-[100px]">
		<!-- Top Bar -->

		<!-- Content Area - Made scrollable -->
		<div class="flex-1 overflow-auto">
			<main class="flex flex-col items-center bg-gray-100 p-6">
				<!-- Rest of the content remains exactly the same -->
				<h1 class="mb-6 text-4xl font-extrabold text-gray-800">
					{!!title ? title : 'No Workspace selected'}
				</h1>

				<form on:submit|preventDefault={handlDescriptionSubmit} class="w-full max-w-2xl space-y-4">
					<!-- Form content remains exactly the same -->
					<p class="text-center text-gray-600">
						Enter your prompt below. Minimum 100 characters required.
					</p>

					<textarea
						bind:value={userPrompt}
						disabled={!title}
						placeholder="Start typing here..."
						class="h-48 w-full resize-none rounded-lg border border-gray-300 p-4 text-gray-700 shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						minlength="100"
						required
					></textarea>

					<p class="text-right text-sm text-gray-500">100 characters minimum</p>

					<div class="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
						<p class="text-sm text-blue-800">
							Note: You can only select a date range up to 7 days maximum. For example, if you
							select January 1st, the latest end date you can select would be January 7th.
						</p>
					</div>

					<div class="flex gap-4">
						<div class="flex-1">
							<label for="fromDate" class="block text-sm font-medium text-gray-700">From Date</label
							>
							<input
								type="date"
								id="fromDate"
								bind:value={fromDate}
								on:change={handleFromDateChange}
								max={toDate ? formatDate(toDate) : calculateMaxDate(fromDate)}
								class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								required
								disabled={!title}
							/>
							<p class="mt-1 text-xs text-gray-500">Maximum range: 7 days</p>
						</div>
						<div class="flex-1">
							<label for="toDate" class="block text-sm font-medium text-gray-700">To Date</label>
							<input
								type="date"
								id="toDate"
								bind:value={toDate}
								on:change={handleToDateChange}
								min={fromDate ? formatDate(fromDate) : ''}
								max={fromDate ? calculateMaxDate(fromDate) : ''}
								class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								required
								disabled={!title}
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={!title}
						class="mt-4 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
					>
						Generate Events
					</button>
				</form>
			</main>
			<EventsContainer current_workspace_id={current_workspace_data?.id} token={data.user.token} />
		</div>
	</div>
</div>

<style>
	/* Custom styles (if needed) */
</style>
