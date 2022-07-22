<template>
  <div id="pause-button">
    <button class="button__pause" @click="$emit('pause-game')">
      <div>
        <p v-if="isMobile">Pause </p>
        <i v-else class="fa-solid fa-pause"></i>
      </div>
    </button>
  </div>
</template>

<script>
import gameFunctions from '../assets/tetris/gameFunctions.js';
export default {
  name: 'PauseButton',
  methods: {
    isMobile() {
      return gameFunctions.isMobile();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/pause-button.scss';
</style>
