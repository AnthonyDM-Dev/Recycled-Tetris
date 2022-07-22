<template>
  <div id="pieces-previewer">
    <h3>NEXT</h3>
    <div class="pieces-previewer__pieces">
      <div 
        v-for="(shape, i) in shapesList"
        :key=i
        class="preview"
        >
        <GameMap
          :is-preview="isPreview"
          :occupied-cells-ids="shape.blocks.map(block => { return block.coords.join('-') })"
          :grid-width="gridWidth"
          :grid-size="gridSize"
          :cell-size="scaledCellSize"
          :theme="theme"
        />
      </div>
    </div>
  </div>
</template>

<script>
import gameFunctions from '../assets/tetris/gameFunctions';
import GameMap from './GameMap.vue';

export default {
  name: 'PiecesPreviewer',
  components: {
    GameMap,
  },
  props: {
    isPreview: {
      type: Boolean,
      default: true,
    },
    shapesList: {
      type: Array,
      default: null,
    },
    gridSize: {
      type: Array,
      default: null
    },
    cellSize: {
      type: Number,
      default: null,
    },
    theme: {
      type: Object,
      default: null
    },
  },
  computed: {
    gridWidth() {
      return this.scaledCellSize * this.gridSize[0];
    },
    scaledCellSize() {
      return gameFunctions.isMobile ? this.cellSize / 2.8 : this.cellSize / 2;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/pieces-previewer.scss';
</style>
