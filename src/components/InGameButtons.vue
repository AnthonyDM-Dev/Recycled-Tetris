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
    <PauseButton
      v-if="isMobile"
      :disabled="!isPlaying || isPause"
      @pause-game="$emit('pause-game')"/>
  </div>
</template>

<script>
import gameFunctions from '../assets/tetris/gameFunctions.js';
import PauseButton from './PauseButton.vue';

export default {
  name: 'InGameButtons',
  components: {
    PauseButton,
  },
  props: {
    hasMusic: {
      type: Boolean,
      default: true,
    },
    hasEffects: {
      type: Boolean,
      default: true,
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
    isPause: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isMobile() {
      return gameFunctions.isMobile;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/in-game-buttons.scss';
</style>
