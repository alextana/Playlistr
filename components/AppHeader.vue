<template>
  <header>
    <AppLogo />

    <div class="user-options ml-auto">
      <!-- st: {{ status }} data: {{ data }} -->
      <div v-if="status === 'unauthenticated'">
        <UiButton kind="primary" size="sm" @click="signIn('spotify')"
          >sign in</UiButton
        >
      </div>
      <div v-if="status === 'loading'">loading..</div>
      <div class="flex items-center gap-2" v-else-if="data">
        <UserAvatar :url="data.user.image" width="40" />
        <button @click="signOut()">
          <Icon name="mdi:logout" size="24" class="hover:text-green-500" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
const { status, data, getSession, signIn, signOut } = useAuth()
</script>
