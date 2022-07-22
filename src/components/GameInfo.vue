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
@import '../assets/styles/game-info.scss';
</style>
