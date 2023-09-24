<template>
  <button class="btn" :class="computedClasses">
    <template v-if="props.state === 'loading'">
      <span class="loading loading-spinner"></span>
      <span v-if="loadingMessage">
        {{ loadingMessage }}
      </span>
      <span v-else> loading </span>
    </template>
    <template v-else-if="props.state === 'error'">
      <Icon name="mi:circle-error" size="24" />
      error
    </template>
    <template v-else-if="props.state === 'done'">
      <Icon name="material-symbols:done" size="24" />
      done!
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script setup>
const props = defineProps({
  kind: {
    type: String,
    default: 'btn-neutral',
    validator(value) {
      // The value must match one of these strings
      return [
        'btn-neutral',
        'btn-primary',
        'btn-secondary',
        'btn-accent',
        'btn-ghost',
        'btn-link',
      ].includes(value)
    },
  },
  size: {
    type: String,
    default: '',
    validator(value) {
      // The value must match one of these strings
      return ['xs', 'sm', 'lg', '', 'wide'].includes(value)
    },
  },
  state: {
    type: String,
    validator(value) {
      return ['loading', 'error', 'done', ''].includes(value)
    },
  },
  loadingMessage: {
    type: String,
  },
})

const computedClasses = computed(() => {
  const buttonVariants = {
    kind: {
      primary: 'btn-primary',
      neutral: 'btn-neutral',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      ghost: 'btn-ghost',
      link: 'btn-link',
    },
    size: {
      xs: 'btn-xs',
      sm: 'btn-sm',
      lg: 'btn-lg',
      wide: 'btn-wide',
    },
  }

  const toCheck = [
    { key: 'kind', value: props.kind },
    { key: 'size', value: props.size },
  ]

  const classes = []

  toCheck.forEach((prop) => {
    prop ? classes.push(buttonVariants[prop.key][prop.value]) : ''
  })

  return classes.join(' ')
})
</script>
