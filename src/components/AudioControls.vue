<template>
  <div id="volume-controls">
    <button class="button__controls" @click="$emit('mute-music')">
      <p>Music</p>
      <i v-if="hasMusic" class="fa-solid fa-volume-high"></i>
      <i v-else class="fa-solid fa-volume-xmark"></i>
    </button>
    <button class="button__controls" @click="$emit('mute-effects')">
      <p>Effects</p>
      <i v-if="hasEffects" class="fa-solid fa-volume-high"></i>
      <i v-else class="fa-solid fa-volume-xmark"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'AudioControls',
  props: {
    hasMusic: {
      type: Boolean,
      default: true,
    },
    hasEffects: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/audio-controls.scss';
</style>
