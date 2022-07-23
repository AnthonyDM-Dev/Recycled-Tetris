<template>
  <div id="tetris">
    <div class="tetris__container">
      <div class="tetris__container-game">
        <GameInfo
          :seconds="seconds"
          :score="score"
          :level-label="levelLabel" />
        <GameMap
          :is-preview="false"
          :occupied-cells-ids="occupiedCellsIds"
          :grid-width="gridWidth"
          :grid-size="gridSize"
          :cell-size="squareSize"
          :theme="gameTheme" />
      </div>
      <div class="features">
        <PauseButton v-if="!isMobile" :disabled="!isPlaying || isPause" @pause-game="changeGameStatus('pause')"/>
        <PiecesPreviewer
          :is-preview="true"
          :shapes-list="shapesList"
          :occupied-cells-ids="occupiedCellsIds"
          :grid-size="[4, 2]"
          :cell-size="squareSize" />
        <AudioControls
          :has-music="audioSettings.backgroundMusic"
          :has-effects="audioSettings.effects"
          :is-playing="isPlaying"
          :is-pause="isPause"
          @mute-music="muteAudio('backgroundMusic')"
          @mute-effects="muteAudio('effects')"
          @pause-game="changeGameStatus('pause')" />
      </div>
    </div>
    <FallingBlocks
      :blocks="blocks"
      :square-size="squareSize"
      :is-playing="isPlaying" />
    <LevelUpPopup v-if="hasLeveledUp" />
    <SettingsPopup
      v-if="popup.isVisible"
      :type="popup.type"
      :best-score="bestScore"
      @start-game="startGame"
      @continue-game="changeGameStatus('continue')"
      @end-game="endGame" />
  </div>
</template>

<script>
import gameFunctions from './assets/tetris/gameFunctions.js';
import GameMap from './components/GameMap.vue';
import GameInfo from './components/GameInfo.vue';
import PiecesPreviewer from './components/PiecesPreviewer.vue';
import FallingBlocks from './components/FallingBlocks.vue';
import SettingsPopup from './components/SettingsPopup.vue';
import LevelUpPopup from './components/LevelUpPopup.vue';
import AudioControls from './components/AudioControls.vue';
import PauseButton from './components/PauseButton.vue';
export default {
  name: 'App',
  components: {
    GameMap,
    GameInfo,
    PiecesPreviewer,
    FallingBlocks,
    SettingsPopup,
    LevelUpPopup,
    AudioControls,
    PauseButton,
  },
  mounted() {
    document.addEventListener('keypress', (event) => {
      if (event.key === "+") {
        this.moveBlocks('rotate', 'right', 'piece');
      } else if (event.key === "-") {
        this.moveBlocks('rotate', 'left', 'piece');
      } else if (event.key === "p" || event.key === "P") {
        this.changeGameStatus('pause');
      } else if (event.key === "c" || event.key === "C") {
        this.changeGameStatus('continue');
      } else if (event.key === "m" || event.key === "M") {
        this.muteAudio('backgroundMusic')
      } else if (event.key === "n" || event.key === "N") {
        this.muteAudio('effects');
      }
    }, false);
    document.addEventListener('keydown', (event) => {
      if (event.code == "ArrowLeft") {
        event.preventDefault();
        this.moveBlocks('push', 'left', 'piece');
      } else if (event.code == "ArrowRight") {
        event.preventDefault();
        this.moveBlocks('push', 'right', 'piece');
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        this.moveBlocks('push', 'down', 'piece');
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        this.moveBlocks('rotate', 'right', 'piece');
      }
    }, false);
    document.ondragstart = () => false;
    document.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      this.setPointerCoords('down', [event.clientX, event.clientY]);
    });
    document.addEventListener('pointerup', (event) => {
      this.setPointerCoords('up', [event.clientX, event.clientY]);
    });
  },
  head: {
    script: [
      { type: 'text/javascript', src: 'https://kit.fontawesome.com/9a2c4fe4ba.js', crossorigin: 'anonymous', body: true },
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'},
    ]
  },
  data() {
    return {
      maxShapesInList: 3,
      hasLeveledUp: false,
      popup: {
        isVisible: true,
        type: 'start-popup',
      },
      bestScore: 15000,
      gameTheme: gameFunctions.getTheme('default'),
      gameStatus: null,
      startingLevel: 0,
      level: 0,
      scoreIncreasingLevel: 5000,
      isPlaying: false,
      isPause: false,
      timeTick: 0,
      timer: null,
      score: 4900,
      audioSettings: {
        backgroundMusic: true,
        effects: true,
      },
      gridSize: [10, 15], // width x length
      gridWidth: gameFunctions.isMobile ? 300 : 360,
      blocks: [],
      occupiedCellsIds: [],
      shapesList: [],
      pointer: {
        startingCoords: null,
        finalCoords: null,
      },
    };
  },
  watch: {
    hasLeveledUp(newVal) {
      if (!newVal) return;
      setTimeout(() => {
        this.hasLeveledUp = !this.hasLeveledUp;
      }, 1000);
    },
    gameStatus(newVal) {
      if (newVal === 'start' || newVal === 'continue') {
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.updateTimer(this.level);
      } else if (newVal === 'lose') {
        clearInterval(this.timer);
      } else if (newVal === 'pause') {
        clearInterval(this.timer);
      }
    },
    timeTick(newVal) {
      if (!newVal) return;
      for (let i = 0; i < this.maxShapesInList; i++) {
        if (this.shapesList.length === this.maxShapesInList) break;
        this.shapesList.push(gameFunctions.generateShape());
      }
      if (gameFunctions.hasPieceOnMap(this.blocks)) {
        this.moveBlocks('push', 'down', 'all');
      } else {
        this.checkRows();
        if (gameFunctions.canShapeBeAdded(this.shapesList[0].blocks, this.occupiedCellsIds)) {
          this.blocks.push(...this.shapesList[0].blocks);
          this.shapesList.shift();
        } else {
          this.changeGameStatus('lose');
        }
      }
    },
    score(newVal) {
      const levelsToAdd = Math.floor(newVal / this.scoreIncreasingLevel);
      if (this.startingLevel + levelsToAdd === this.level) return;
      this.increaseDifficulty();
    }
  },
  methods: {
    setPointerCoords(pointerAction, coords) {
      if (pointerAction === 'down') {
        this.pointer.startingCoords = coords;
      } else if (pointerAction === 'up') {
        this.pointer.finalCoords = coords;
        if (this.pointer.startingCoords) {
          this.moveBlocks(...gameFunctions.getPointerResult(this.pointer));
        }
      }
    },
    resetConditions() {
      this.occupiedCellsIds = [];
      this.blocks = [];
      this.score = 0;
      this.timeTick = 0;
      this.isPlaying = false;
      this.isPause = false;
    },
    triggerSettingsPopup(value, popupType) {
      this.popup.isVisible = value;
      this.popup.type = popupType;
    },
    endGame() {
      this.changeGameStatus('lose');
      this.triggerSettingsPopup(true, 'start-popup');
    },
    startGame(event) {
      this.resetConditions();
      this.gridSize = event.gridSize.value.split('x').map(size => { return Number(size) });
      this.gameTheme = gameFunctions.getTheme(event.theme.value);
      this.startingLevel = Number(event.level.value) - 1;
      this.level = this.startingLevel;
      this.triggerSettingsPopup(false, 'start-popup');
      this.changeGameStatus('start');
    },
    muteAudio(soundType) {
      this.audioSettings[soundType] = !this.audioSettings[soundType];
      gameFunctions.playAudio(soundType);
    },
    increaseDifficulty() {
      this.hasLeveledUp = gameFunctions.hasLeveledUp(this.level);
      this.level += 1;
      clearInterval(this.timer);
      this.updateTimer(this.level);
      gameFunctions.playAudio('levelUp');
    },
    changeGameStatus(status) {
      if (status === this.gameStatus) return;
      if (status === 'start') {
        this.isPlaying = true;
        this.isPause = false;
        gameFunctions.playAudio('start');
      } else if (status === 'lose') {
        this.isPlaying = false;
        this.isPause = false;
        gameFunctions.playAudio('lose');
        this.triggerSettingsPopup(true, 'start-popup');
        this.bestScore = gameFunctions.getHighscore(this.score, this.bestScore);
      } else if (status === 'pause') {
        if (!this.isPlaying) return;
        this.isPause = true;
        this.triggerSettingsPopup(true, 'options-popup');
        gameFunctions.playAudio('pause');
      } else if (status === 'continue') {
        if (!this.isPause) return;
        this.isPause = false;
        this.triggerSettingsPopup(false, 'start-popup');
        gameFunctions.playAudio('continue');
      }
      this.gameStatus = status;
    },
    checkRows() {
      let cellToDelete = 0;
      const coordsArray = this.occupiedCellsIds.map(cell => { return cell.split('-') });
      for (let i = 0; i < coordsArray.length; i++) {
        const row = coordsArray.filter(coord => { return coord[1] === coordsArray[i][1] });
        if (row.length >= this.gridSize[0]) {
          cellToDelete += 1;
          this.deleteRow(coordsArray[i][1]);
          this.score += gameFunctions.addScore('row');
        }
      }
      for (let i = 0; i < (cellToDelete / this.gridSize[0]); i++) {
        this.moveBlocks('push', 'down', 'row');
      }
      if (cellToDelete) {
        gameFunctions.playAudio('score');
      }
    },
    deleteRow(rowNumber) {      
      this.occupiedCellsIds = this.occupiedCellsIds.filter(cell => {
        return cell.split('-')[1] !== rowNumber
      });
      this.blocks = this.blocks.filter(block => {
        return block.coords[1].toString() !== rowNumber
      });
      for (let i = 0; i < this.blocks.length; i++) {
        if (!this.blocks[i].isMovable) {
          gameFunctions.updateBlockField(this.blocks[i], 'isMovable', true);
        }
      }
    },
    updateOccupiedCellsIds() {
      this.occupiedCellsIds = this.blocks.map(block => { return block.coords.join('-') });
    },
    moveRows(action, direction) {
      let canRowSlide = false;
      for (let i = this.gridSize[1] - 1; i > -1; i--) {
        if (canRowSlide) {
          const movableRow = this.blocks.filter(block => {
            return block.coords[1] === i && block.isPiece === false
          });
          for (let i = 0; i < movableRow.length; i++) {
            const newBlock = gameFunctions.getNewBlockPosition(action, direction, movableRow[i]);
            for (let [key, value] of Object.entries(newBlock)) {
              gameFunctions.updateBlockField(movableRow[i], key, value);
            }
            this.updateOccupiedCellsIds();
          }
        }
        const row = this.blocks.filter(block => {
          return block.coords[1] === i
        });
        if (!row.length) {
          canRowSlide = true;
        }
      }
    },
    movePiece(action, direction, type) {
      const movablePieces = gameFunctions.getMovableBlocks('piece', this.blocks).sort((a, b) => {
        return gameFunctions.getSortedCoords(a, b, direction);
      });
      const isPieceMovable = gameFunctions.checkPieceMobility(action, direction, movablePieces, this.blocks);
      if (isPieceMovable) {
        for (let i = 0; i < movablePieces.length; i++) {
          const newBlock = gameFunctions.getNewBlockPosition(action, direction, movablePieces[i]);
          for (let [key, value] of Object.entries(newBlock)) {
            gameFunctions.updateBlockField(movablePieces[i], key, value);
          }
          this.updateOccupiedCellsIds();
        }
        if (movablePieces.length) {
          if (movablePieces[0].isMovable && direction === 'down' && type === 'piece') {
            this.score += gameFunctions.addScore('push');
          }
        }
        gameFunctions.playAudio(action);
      } else if (direction === 'down') {
        for (let i = 0; i < movablePieces.length; i++) {
          gameFunctions.updateBlockField(movablePieces[i], 'isMovable', false);
          gameFunctions.updateBlockField(movablePieces[i], 'isPiece', false);
        }
        this.updateOccupiedCellsIds();
      } else {
        gameFunctions.playAudio('error');
      }
    },
    moveBlocks(action, direction, type) {
      if (this.gameStatus === 'pause' || !this.isPlaying) return;
      if (type === 'row' || type === 'all') {
        this.moveRows(action, direction);
      }
      if (type === 'piece' || type === 'all') {
        this.movePiece(action, direction, type);
      }
    },
    updateTimer(levelId) {
      const velocity = gameFunctions.getVelocity(levelId);
      this.timer = setInterval(() => {
        this.timeTick += ( velocity / 1000 );
      }, velocity);
    },
  },
  computed: {
    isMobile() {
      return gameFunctions.isMobile;
    },
    squareSize() {
      return this.gridWidth / this.gridSize[0];
    },
    seconds() {
      return this.timeTick.toFixed(0);
    },
    levelLabel() {
      return gameFunctions.getLevelLabel(this.level);
    },
  }
}
</script>

<style lang="scss">
@import './assets/styles/app.scss';
</style>