<template>
  <div id="settings-popup">
    <!-- TITLE -->
    <div class="settings__title">
      <div class="settings__title-header">
        <h1>Recycled<br>Tetris</h1>
      </div>
      <div class="settings__title-image">
        <img :src="require('/src/static/recycle.png')" class="recycle"/>
      </div>
    </div>

    <!-- HIGHSCORE TABLE -->
    <div class="highscore-table">
      <p class="highscore-table__title">Best Score</p>
      <p class="highscore-table__score">{{ bestScore }}</p>
    </div>

    <div class="settings__container">
      <!-- STARTING SETTINGS -->
      <div v-if="type === 'start-popup'">
        <form name="settings">
          <div class="settings__options-radio">
            <div>
              <p class="options__title">Grid Size</p>
              <div class="options__radio">
                <div>
                  <input type="radio" id="normal" name="gridSize" value="10x15" checked>
                  <label for="normal">10 x 15</label>
                </div>
                <div>
                  <input type="radio" id="large" name="gridSize" value="12x18">
                  <label for="large">12 x 18</label>
                </div>
                <div>
                  <input type="radio" id="extra-large" name="gridSize" value="15x20">
                  <label for="extra-large">15 x 20</label>
                </div>
              </div>
            </div>
            <div>
              <p class="options__title">Theme</p>
              <div class="options__radio">
                <div>
                  <input type="radio" id="default" name="theme" value="default" checked>
                  <label for="default">Default</label>
                </div>
                <div>
                  <input type="radio" id="bricks" name="theme" value="bricks">
                  <label for="bricks">Bricks</label>
                </div>
                <div>
                  <input type="radio" id="sea" name="theme" value="sea">
                  <label for="sea">Sea</label>
                </div>
              </div>
            </div>
          </div>
          <p class="options__title">Starting difficulty</p>
          <div class="options__qty-selector">
            <button class="qty-selector__selector" @click.prevent="addLevel(-1)">
              <i class="fa-solid fa-minus"></i>
            </button>
            <input name="level" class="qty-selector__qty" readonly value="1"/>
            <button class="qty-selector__selector" @click.prevent="addLevel(1)">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="settings__buttons">
            <button v-if="isHowToPlayVisible" class="button__main" @click="triggerInstructions"><p>Close</p></button>
            <button v-if="!isHowToPlayVisible" class="button__main" @click="triggerInstructions"><p>Controls</p></button>
            <button class="button__main" type="submit" @click.prevent="startGame">
              <p>Start <i class="fa-solid fa-play"></i></p>
            </button>
          </div>
        </form>
      </div>

      <!-- PAUSE SETTINGS -->
      <div v-else-if="type === 'options-popup'">
        <div class="options-popup__buttons">
          <button v-if="isHowToPlayVisible" class="button__main" @click="triggerInstructions"><p>Back to Menu</p></button>
          <button v-if="!isHowToPlayVisible" class="button__main" @click="$emit('continue-game')"><p>Continue</p></button>
          <button v-if="!isHowToPlayVisible" class="button__main" @click="triggerInstructions"><p>Controls</p></button>
          <button v-if="!isHowToPlayVisible" class="button__main" @click="$emit('end-game')"><p>Quit</p></button>
        </div>
      </div>

      <!-- HOW TO PLAY RULES. VISIBLE IN BOTH SETTINGS TYPES- -->
      <div>
        <div v-show="isHowToPlayVisible" class="how-to-play__container">
          <div class="how-to-play__rule">
            <div class="how-to-play__button"><i class="fa-solid fa-hand-pointer"></i></div>
            <p>Swipe to move</p>
          </div>
          <p style="margin: 5px auto;">OR:</p>
          <div class="how-to-play__rule">
            <div class="how-to-play__button"><i class="fa-solid fa-arrow-down"></i></div>
            <p>Push down</p>
          </div>
          <div class="how-to-play__rule">
            <div class="how-to-play__button"><i class="fa-solid fa-arrow-left"></i></div>
            <p>Move left</p>
          </div>
          <div class="how-to-play__rule">
            <div class="how-to-play__button"><i class="fa-solid fa-arrow-right"></i></div>
            <p>Move right</p>
          </div>
          <div class="how-to-play__rule">
            <div class="how-to-play__button"><i class="fa-solid fa-plus"></i></div>
            <p>Rotate clockwise</p>
          </div>
          <div class="how-to-play__rule">
            <div class="how-to-play__button"><i class="fa-solid fa-minus"></i></div>
            <p>Rotate counterclockwise</p>
          </div>
          <div class="how-to-play__rule">
            <div class="how-to-play__button">P</div>
            <p>Pause</p>
          </div>
          <div class="how-to-play__rule">
            <div class="how-to-play__button">C</div>
            <p>Continue</p>
          </div>
          <div class="how-to-play__rule">
            <div class="how-to-play__button">M</div>
            <p>Mute music</p>
          </div>
          <div class="how-to-play__rule">
            <div class="how-to-play__button">N</div>
            <p>Mute effects</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPopup',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: null,
    },
    bestScore: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isHowToPlayVisible: false,
    }
  },
  methods: {
    triggerInstructions() {
      this.isHowToPlayVisible = !this.isHowToPlayVisible;
    },
    startGame() {
      this.$emit('startGame', document.forms.settings);
    },
    addLevel(num) {
      const qtyTag = document.getElementsByClassName('qty-selector__qty')[0];
      let val = Number(qtyTag.value);
      if ((val + num >= 1) && (val + num <= 10)) {
        val += num;
      }
      return qtyTag.value = val;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/settings-popup.scss';
</style>
