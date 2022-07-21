<template>
  <div id="game-info">
    <div class="game-info__property">
      <p>TIME</p>
      <p>{{ seconds }}</p>
    </div>
    <div class="game-info__property">
      <p>SCORE</p>
      <p>{{ score }}</p>
    </div>
    <div class="game-info__property">
      <p>LEVEL</p>
      <p>{{ levelLabel }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameInfo',
  props: {
    seconds: {
      type: [Number, String],
      default: null,
    },
    score: {
      type: [Number, String],
      default: null,
    },
    levelLabel: {
      type: String,
      default: null
    },
  },
}
</script>

<style lang="scss" scoped>
#game-info {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.365);
  border: 3px solid white;
}
.game-info {
  &__property {
    padding: 5px;
  }
}
</style>
