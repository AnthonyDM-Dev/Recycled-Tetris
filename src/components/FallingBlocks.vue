<template>
  <div id="falling-blocks">
    <div
      v-for="(block, i) in blocks"
      :key="i"
      class="block"
      :style="getBlockStyle(block.coords)">
      <div :style="{
        position: 'absolute',
        width: squareSize + 'px',
        height: squareSize + 'px',
        backgroundColor: !this.isPlaying ? 'rgba(0, 0, 0, 0.66)': null,
      }"></div>
      <img :src="block.img" :style="{
        width: squareSize + 'px',
        height: squareSize + 'px',
        transform: 'rotate(' + -block.angleDegree + 'deg)',
      }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FallingBlocks',
  props: {
    blocks: {
      type: Array,
      default: null,
    },
    squareSize: {
      type: Number,
      default: null,
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getBlockStyle(coords) {
      const startingPoint = document.getElementById(coords.join('-'));
      return {
        width: this.squareSize + 'px',
        height: this.squareSize + 'px',
        top: startingPoint.offsetTop + 'px',
        left: startingPoint.offsetLeft + 'px',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/* #falling-blocks {
  
} */
.block {
  position: absolute;
  box-sizing: border-box;
  background-color: transparent;
  transition: top 0.1s, left 0.1s;
}
</style>
