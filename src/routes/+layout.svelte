<script>
	import '../app.css';
	import { loader } from '$lib/stores/loader';
	import LoadingAnimation from '$lib/common/LoadingAnimation.svelte';
</script>

<slot></slot>

{#if $loader}
	<div
		class="fixed bottom-0 left-0 right-0 top-0 z-[100] flex items-center justify-center bg-slate-800/60"
	>
		<LoadingAnimation />
	</div>
{/if}
