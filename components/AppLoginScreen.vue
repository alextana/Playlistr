<template>
  <main>
    <section
      class="hero-div text-center bg-indigo-700 grid place-content-center text-lime-400"
      style="height: calc(100vh - 55px)"
    >
      <UiText el="h1" class="text-6xl tracking-tighter leading-relaxed"
        >Easily manage your Spotify playlists</UiText
      >
      <UiText el="h2" class="text-4xl leading-relaxed font-normal">
        Create a party playlist in minutes!
      </UiText>

      <UiButton
        @click="handleSignin()"
        kind="primary"
        loadingMessage="Logging in..."
        size="sm"
        :state="buttonState"
        class="mt-4 w-max mx-auto"
        >Signin with Spotify</UiButton
      >
    </section>
  </main>
</template>

<script setup>
const { signIn } = useAuth()
const buttonState = ref('')

const handleSignin = () => {
  buttonState.value = 'loading'
  signIn('spotify')
}
</script>
