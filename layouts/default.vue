<template>
  <div :class="{ 'px-2': status === 'authenticated' }">
    <AppHeader
      :class="`w-full h-[55px] ${classes.app.appBackground} ${
        status === 'unauthenticated' ? 'border-b' : ''
      } border-b-indigo-600 flex items-center p-3`"
    />
    <template v-if="status === 'unauthenticated'">
      <AppLoginScreen />
    </template>
    <template v-else-if="status === 'authenticated'">
      <div class="flex gap-2">
        <AppSidebar
          :class="`app-sidebar max-w-[80px] lg:max-w-[320px] min-w-[80px] lg:min-w-[320px] ${classes.app.contentBackground} rounded-2xl`"
          :style="contentHeight"
        />
        <AppContent
          :class="`main-section ${classes.app.contentBackground} w-full py-3 px-6 rounded-2xl`"
          :style="contentHeight"
        >
          <slot />
        </AppContent>
      </div>
      <AppPlayer />
    </template>
  </div>
</template>

<script setup>
import { classes } from '~/components/utils/classes'
// layout varies based on device, we'll have some rules here
// worrying about desktop now as a proof of concept
const contentHeight = `height: calc(100vh - 55px - 100px)`

const { status, data, signIn, signOut } = useAuth()
</script>
