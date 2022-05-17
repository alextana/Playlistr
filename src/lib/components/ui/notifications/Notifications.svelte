<script>
	import { notifications } from '$lib/stores/notifications';
	import { v4 as uuidv4 } from 'uuid';
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	export let notification = null;
	export let duration = 2000;

	let notificationStack = [];
	let intervalStarted = false;
	let removeNotifications = null;
	let isHoveringOver = false;
	const icon = '';
	const thumbnail = '';

	$: if (notification) {
		sendNotification(notification);
	}

	$: if (notificationStack?.length || isHoveringOver) {
		// start interval when stack is not empty and interval
		// hasn't already been started
		if (!intervalStarted) {
			intervalStarted = true;
			removeNotifications = setInterval(() => {
				notificationStack.shift();
				notificationStack = $notifications;
			}, duration);
			// stop interval if hovering
		} else if (isHoveringOver) {
			clearInterval(removeNotifications);
			intervalStarted = false;
		}
		// stop interval when stack is empty
	} else {
		clearInterval(removeNotifications);
		intervalStarted = false;
	}
	function handleNotificationClick(notification) {
		if (!notification.link) {
			return;
		}
		goto(notification.link);
	}
	function handleMouseOver() {
		isHoveringOver = true;
	}
	function handleMouseLeave() {
		isHoveringOver = false;
	}
	// send notification to the stack
	function sendNotification({ type, message, link = '', icon = '', thumbnail = '' }) {
		$notifications = [...$notifications, { type, message, id: uuidv4(), link, icon, thumbnail }];
		notificationStack = $notifications;
	}
	function removeNotification(notification) {
		return () => {
			$notifications = $notifications.filter((n) => n.id !== notification);
			notificationStack = $notifications;
		};
	}
	function getClass(type) {
		switch (type) {
			case 'success':
				return `bg-green-700 text-white px-4 py-2`;
			case 'error':
				return `bg-red-700 text-white px-4 py-2`;
			case 'warning':
				return `bg-yellow-500 text-black px-4 py-2`;
			default:
				return `bg-white text-black px-4 py-2`;
		}
	}

	// reset the store and stack in case
	// the component is mounted on a new page
	// and there still are some active notifications
	// that need to be reset
	onMount(() => {
		if (notificationStack.length > 0) {
			notificationStack = [];
			$notifications = notificationStack;
		}
	});
</script>

{#if notificationStack?.length}
	<div class="fixed bottom-4 right-4">
		{#each notificationStack || [] as notification, i (notification?.id)}
			<div
				on:click={handleNotificationClick(notification)}
				on:mouseover={handleMouseOver}
				on:focus={handleMouseOver}
				on:mouseleave={handleMouseLeave}
				on:blur={handleMouseLeave}
				transition:fly={{ x: 30, duration: 300 }}
				animate:flip={{ delay: 300, duration: 300, easing: quintOut }}
				class="notification relative mb-4 flex gap-6 items-center space-between {notification.type} {notification?.link
					? 'cursor-pointer'
					: ''}
      {getClass(notification.type)}"
			>
				{#if thumbnail !== ''}
					<div class="">
						<img src={thumbnail} alt="thumbnail" />
					</div>
				{:else if icon !== ''}
					{@html icon}
				{/if}
				<div class="">
					{notification.message}
				</div>
				<div
					class="notification__close absolute cursor-pointer hover:bg-zinc-800 hover:text-white -right-3 -top-3 bg-white rounded-full p-1 shadow-2xl text-black"
					on:click={removeNotification(notification.id)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
		{/each}
	</div>
{/if}
