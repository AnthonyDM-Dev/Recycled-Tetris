<template>
  <div id="pieces-previewer">
    <h3>NEXT</h3>
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
</template>

<script>
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
      return this.cellSize / 2;
    }
  }
}
</script>

<style lang="scss" scoped>
#pieces-previewer {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 150px;
  height: 250px;
  border: 2px solid white;
  background-color: rgba(0, 0, 0, 0.365);
  padding: 20px 10px;
  margin: 20px;
}
.preview {
  margin: 10px;
}
</style>
