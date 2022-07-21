<template>
  <div id="game-map">
    <div class="game__grid" :style="gridStyle">
      <div
        v-for="(cell, i) in cellQuantity"
        :key="i"
        :id="getCellId(i)"
        class="game__cell"
        :class="{
          'occupied' : getOccupiedCells(getCellId(i)),
          'preview': isPreview ? getOccupiedCells(getCellId(i)) : false,
        }"
        :style="cellStyle">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameMap',
  components: {
    
  },
  props: {
    isPreview: {
      type: Boolean,
      default: false,
    },
    occupiedCellsIds: {
      type: Array,
      default: null,
    },
    gridSize: {
      type: Array,
      default: null
    },
    gridWidth: {
      type: Number,
      default: null,
    },
    cellSize: {
      type: Number,
      default: null,
    },
    theme: {
      type: Object,
      default: null,
    },
  },
  methods: {
    getCellId(value) {
      return Math.floor(value % this.gridSize[0]) + '-' + Math.floor(value / this.gridSize[0]);
    },
    getOccupiedCells(id) {
      if (this.occupiedCellsIds.includes(id)) return true;
      return false;
    },
  },
  computed: {
    gridStyle() {
      return {
        width: this.gridWidth + 'px',
      }
    },
    cellStyle() {
      return {
        width: this.cellSize + 'px',
        height: this.cellSize + 'px',
        backgroundImage: this.theme?.img ? 'url(' + this.theme.img + ')' : null,
        backgroundRepeat: 'no-repeat',
        backgroundSize: this.cellSize + 'px',
        border: this.theme?.border ? this.theme.border : null,
      }
    },
    cellQuantity() {
      return this.gridSize[0] * this.gridSize[1];
    }
  }
}
</script>

<style lang="scss" scoped>
.game {
  &__grid {
    display: flex;
    flex-wrap: wrap;
  }
  &__cell {
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.365);
    // mix-blend-mode: exclusion;
  }
}
.occupied {
  background-color: #9c7448;
}
.preview {
  background-color: white;
  border: 1px solid green;
}
</style>
