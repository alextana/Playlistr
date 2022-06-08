<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	export let type;
	export let extraClass = '';
	export let customClass = '';
	export let loadingClass = 'bg-gray-400 pr-12 overflow-hidden';
	export let doneClass =
		'bg-green-500 focus:ring-green-800 hover:bg-green-600 pr-12 text-white pointer-events-none overflow-hidden';
	export let errorClass =
		'bg-red-500 hover:bg-red-800 focus:bg-red-800 text-white pr-12 overflow-hidden';
	export let disabled = false;
	export let loading = false;
	export let done = false;
	export let error = false;
	export let svgIcon = null;

	// remove done after 3 seconds and also reset loading if done or error
	$: if (done) {
		loading = false;
		setTimeout(() => {
			done = false;
		}, 3000);
	}

	$: if (error) {
		loading = false;
		setTimeout(() => {
			error = false;
		}, 3000);
	}

	// reset loading state if active from previous interaction
	onMount(() => {
		if (loading) {
			loading = false;
		}
	});

	let classToUse = '';

	const primary = `
    bg-green-500 hover:bg-green-600 uppercase font-bold px-3 py-1 rounded-full
    w-max pl-4 pr-12 cursor-pointer
  `;
	const secondary = `
  bg-gray-500 hover:bg-gray-600 uppercase font-bold px-3 py-1 rounded-full
    w-max pl-4 pr-12 cursor-pointer
  `;

	const warning = `
  bg-red-500 hover:bg-red-600 text-white uppercase font-bold px-3 py-1 rounded-full
    w-max pl-4 pr-12 cursor-pointer
  `;

	const success = `
  bg-green-500 hover:bg-green-600 uppercase font-bold px-3 py-1 rounded-full
    w-max pl-4 pr-12 cursor-pointer
  `;

	switch (type?.toLowerCase()) {
		case 'custom':
			classToUse = customClass;
			break;
		case 'secondary':
			classToUse = secondary;
			break;
		case 'warning':
			classToUse = warning;
			break;
		case 'success':
			classToUse = success;
			break;
		default:
			classToUse = primary;
	}
</script>

<button
	on:click
	class="relative font-bold transition-all {loading ? loadingClass : ''} {done
		? doneClass
		: ''} {error ? `shake ${errorClass}` : ''}{classToUse} {extraClass}"
	{disabled}
>
	<slot />

	{#if done}
		<span
			transition:fly|local={{ duration: 300, y: 30, easing: quintInOut }}
			class="button-icon absolute right-2 top-2/4	transform -translate-y-2/4"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-7 w-7"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	{:else if loading}
		<span
			transition:fly|local={{ duration: 300, x: 30, easing: quintInOut }}
			class="button-icon absolute right-2 top-2/4	transform -translate-y-2/4"
		>
			<svg class="spinner" viewBox="0 0 50 50">
				<circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
			</svg>
		</span>
	{:else if error}
		<span
			transition:fly|local={{ duration: 300, x: 30, easing: quintInOut }}
			class="button-icon absolute right-2 top-2/4	transform -translate-y-2/4"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-7 w-7"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	{:else if svgIcon}
		<span
			transition:fly|local={{ duration: 300, y: 30, easing: quintInOut }}
			class="button-icon absolute right-2 top-2/4	transform -translate-y-2/4"
		>
			{#if svgIcon}{@html svgIcon}{/if}
		</span>
	{/if}
</button>

<style>
	.spinner {
		animation: rotate 2s linear infinite;
		z-index: 2;
		width: 20px;
		height: 20px;
		z-index: 15;
	}

	.path {
		stroke: white;
		stroke-linecap: round;
		animation: dash 1.5s ease-in-out infinite;
	}
	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -124;
		}
	}

	.shake {
		animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
		transform: translate3d(0, 0, 0);
		backface-visibility: hidden;
		perspective: 1000px;
	}
	@keyframes shake {
		10%,
		90% {
			transform: translate3d(-1px, 0, 0);
		}

		20%,
		80% {
			transform: translate3d(2px, 0, 0);
		}

		30%,
		50%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}

		40%,
		60% {
			transform: translate3d(4px, 0, 0);
		}
	}
</style>
