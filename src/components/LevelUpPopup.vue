<template>
  <div id="level-up-popup">
    <h1>Level up!</h1>
  </div>
</template>

<script>
export default {
  name: 'LevelUpPopup',
}
</script>

<style lang="scss" scoped>
#level-up-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  color: white;
  border: 1px solid red;
}
</style>
