<script>
	export let green = false;
</script>

<button
	on:click
	class="px-8 py-1 rounded-full border {green
		? 'bg-green-500 text-black border-transparent hover:bg-green-800 hover:text-white'
		: ''} border-gray-400 w-max text-xs uppercase font-semibold hover:bg-green-500 hover:text-black hover:border-green-500"
	><slot /></button
>
