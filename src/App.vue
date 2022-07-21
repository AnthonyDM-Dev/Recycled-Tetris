<template>
  <div id="tetris-game">
    <div class="tetris__container">
      <div class="tetris__container-game">
        <GameInfo
          :seconds="seconds"
          :score="score"
          :level-label="levelLabel"
        />
        <GameMap
          :is-preview="false"
          :occupied-cells-ids="occupiedCellsIds"
          :grid-width="gridWidth"
          :grid-size="gridSize"
          :cell-size="squareSize"
          :theme="gameTheme"
        />
      </div>
      <PiecesPreviewer
        :is-preview="true"
        :shapes-list="shapesList"
        :occupied-cells-ids="occupiedCellsIds"
        :grid-size="[4, 2]"
        :cell-size="squareSize"
      />
      <div class="buttons__container">
        <button @click="changeGameStatus('pause')">
          <div v-if="isPlaying && !isPause">
            <p>Pause</p>
            <i class="fa-solid fa-pause"></i>
          </div>
        </button>
        <button @click="muteAudio('backgroundMusic')">
          <p>Music</p>
          <i v-if="audioSettings.backgroundMusic" class="fa-solid fa-volume-high"></i>
          <i v-else class="fa-solid fa-volume-xmark"></i>
        </button>
        <button @click="muteAudio('effects')">
          <p>Effects</p>
          <i v-if="audioSettings.effects" class="fa-solid fa-volume-high"></i>
          <i v-else class="fa-solid fa-volume-xmark"></i>
        </button>
      </div>
    </div>
    <FallingBlocks
      :blocks="blocks"
      :square-size="squareSize"
      :is-playing="isPlaying"
    />
    <LevelUpPopup v-if="hasLeveledUp" />
    <SettingsPopup
      v-if="popup.isVisible"
      :type="popup.type"
      @start-game="startGame"
      @continue-game="changeGameStatus('continue')"
      @end-game="endGame"/>
  </div>
</template>

<script>
import gamePieces from './assets/tetris/gamePieces.js';
import gameLevels from './assets/tetris/gameLevels.js';
import gameSounds from './assets/tetris/gameSounds.js';
import gameThemes from './assets/tetris/gameThemes.js';
import GameMap from './components/GameMap.vue';
import GameInfo from './components/GameInfo.vue';
import PiecesPreviewer from './components/PiecesPreviewer.vue';
import FallingBlocks from './components/FallingBlocks.vue';
import SettingsPopup from './components/SettingsPopup.vue';
import LevelUpPopup from './components/LevelUpPopup.vue';

export default {
  name: 'App',
  components: {
    GameMap,
    GameInfo,
    PiecesPreviewer,
    FallingBlocks,
    SettingsPopup,
    LevelUpPopup,
  },
  mounted() {
    document.addEventListener('keypress', (event) => {
      if (event.key === "+") {
        this.rotatePiece('rotate', 'right', 'piece');
      } else if (event.key === "-") {
        this.rotatePiece('rotate', 'left', 'piece');
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
        this.rotatePiece('rotate', 'right', 'piece');
      }/* else if (event.code === "Enter") {
        event.preventDefault();
        this.startGame();
      } */
    }, false);
  },
  head: {
    script: [
      // Font awesome
      { type: 'text/javascript', src: 'https://kit.fontawesome.com/9a2c4fe4ba.js', crossorigin: 'anonymous', body: true },
    ],
    link: [
      // Google Fonts
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'},
    ]
  },
  data() {
    return {
      hasLeveledUp: false,
      popup: {
        isVisible: true,
        type: 'start-popup',
      },
      gameTheme: gameThemes.themes.default,
      gameStatus: null,
      startingLevel: 0,
      level: 0,
      scoreIncreasingLevel: 5000,
      isPlaying: false,
      isPause: false,
      timeTick: 0,
      timer: null,
      score: 4900,
      sounds: {
        backgroundMusic: new Audio(gameSounds.soundPaths.backgroundMusic),
        moveBlock: new Audio(gameSounds.soundPaths.moveBlock),
        rotateBlock: new Audio(gameSounds.soundPaths.rotateBlock),
        score: new Audio(gameSounds.soundPaths.score),
        pauseGame: new Audio(gameSounds.soundPaths.pauseGame),
        continueGame: new Audio(gameSounds.soundPaths.continueGame),
        loseGame: new Audio(gameSounds.soundPaths.loseGame),
        error: new Audio(gameSounds.soundPaths.error),
        levelUp: new Audio(gameSounds.soundPaths.levelUp),
      },
      audioSettings: {
        backgroundMusic: true,
        effects: true,
      },
      gridSize: [10, 15], // width x length
      gridWidth: 360,
      blocks: [],
      occupiedCellsIds: [],
      shapesList: [],
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
      const hasPieceOnMap = this.blocks.find(block => { return block.isPiece });
      this.generateShapes();
      if (hasPieceOnMap) {
        this.pushBlocks('push', 'down', 'all');
      } else {
        this.checkRows();
        if (this.checkAddShape(this.shapesList[0].blocks)) {
          this.addShape(this.shapesList[0].blocks);
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
      this.gameTheme = gameThemes.themes[event.theme.value];
      this.startingLevel = Number(event.level.value) - 1;
      this.level = this.startingLevel;
      this.triggerSettingsPopup(false, 'start-popup');
      this.changeGameStatus('start');
    },
    muteAudio(soundType) {
      this.audioSettings[soundType] = !this.audioSettings[soundType];
      this.playAudio(soundType);
    },
    increaseDifficulty() {
      const level = gameLevels.levels.find(level => { return level.id === (this.level + 1) });
      if (!level) return;
      this.hasLeveledUp = true;
      this.level += 1;
      clearInterval(this.timer);
      this.updateTimer(this.level);
      this.playAudio('levelUp');
    },
    playAudio(action) {
      if (action === 'rotate') {
        this.sounds.rotateBlock.play();
      } else if (action === 'push') {
        this.sounds.moveBlock.play();
      } else if (action === 'score') {
        this.sounds.score.play();
      } else if (action === 'start') {
        this.sounds.backgroundMusic.loop = true;
        this.sounds.backgroundMusic.currentTime = 0;
        this.sounds.backgroundMusic.play();
      } else if (action === 'lose') {
        this.sounds.backgroundMusic.pause();
        this.sounds.loseGame.play();
      } else if (action === 'pause') {
        this.sounds.backgroundMusic.pause();
        this.sounds.pauseGame.play();
      } else if (action === 'continue') {
        this.sounds.continueGame.play();
        this.sounds.backgroundMusic.play();
      } else if (action === 'error') {
        this.sounds.error.play();
      } else if (action === 'backgroundMusic') {
        this.sounds.backgroundMusic.muted = !this.sounds.backgroundMusic.muted;
      } else if (action === 'effects') {
        for (let key of Object.entries(this.sounds)) {
          if (key[0] === 'backgroundMusic') continue;
          this.sounds[key[0]].muted = !this.sounds[key[0]].muted;
        }
      } else if (action === 'levelUp') {
        this.sounds.levelUp.play();
      }
    },
    updateScore(type) {
      if (type === 'row') {
        this.score += 100
      } else if (type === 'push') {
        this.score += 10
      }
    },
    changeGameStatus(status) {
      if (status === this.gameStatus) return;

      if (status === 'start') {
        this.isPlaying = true;
        this.isPause = false;
        this.playAudio('start');
      } else if (status === 'lose') {
        this.isPlaying = false;
        this.isPause = false;
        // this.updateHighscore();
        this.playAudio('lose');
        this.triggerSettingsPopup(true, 'start-popup');
        alert('You lose motherfucker!');
      } else if (status === 'pause') {
        if (!this.isPlaying) return;
        this.isPause = true;
        this.triggerSettingsPopup(true, 'options-popup');
        this.playAudio('pause');
      } else if (status === 'continue') {
        if (!this.isPause) return;
        this.isPause = false;
        this.triggerSettingsPopup(false, 'start-popup');
        this.playAudio('continue');
      }
      this.gameStatus = status;
    },
    compareCoords(aCoords, bCoords) {
      if (aCoords[0] === bCoords[0] && aCoords[1] === bCoords[1]) return true;
      return false;
    },
    updateBlockField(blockObj, key, value) {
      blockObj[key] = value;
    },
    generateShapes() {
      for (let i = 0; i < 3; i++) {
        if (this.shapesList.length === 3) break;
        this.shapesList.push(JSON.parse(JSON.stringify(
          gamePieces.pieces[this.getRandomNumInRange(0, gamePieces.pieces.length)]
        )));
      }
    },
    checkAddShape(newShape) {
      const duplicatedCells = newShape.filter(block => {
        return this.occupiedCellsIds.includes(block.coords.join('-'))
      });
      return duplicatedCells.length === 0;
    },
    checkRows() {
      let cellToDelete = 0;
      const coordsArray = this.occupiedCellsIds.map(cell => { return cell.split('-') });
      for (let i = 0; i < coordsArray.length; i++) {
        const row = coordsArray.filter(coord => { return coord[1] === coordsArray[i][1] });
        if (row.length >= this.gridSize[0]) {
          cellToDelete += 1;
          this.deleteRow(coordsArray[i][1]);
          this.updateScore('row');
        }
      }
      for (let i = 0; i < (cellToDelete / this.gridSize[0]); i++) {
        this.moveBlocks('push', 'down', 'row');
      }
      if (cellToDelete) {
        this.playAudio('score');
      }
    },
    /* subtractSimpleArrays(arr1, arr2) {
      return arr1.concat(arr2).filter(item => !arr1.includes(item) || !arr2.includes(item));
    } */
    deleteRow(rowNumber) {      
      this.occupiedCellsIds = this.occupiedCellsIds.filter(cell => {
        return cell.split('-')[1] !== rowNumber
      });
      this.blocks = this.blocks.filter(block => {
        return block.coords[1].toString() !== rowNumber
      });

      /* const indexOfObject = arr.findIndex(object => {
        return this.compareCoords(block.coords, newBlock.coords)object.id === 3;
      }); */

      for (let i = 0; i < this.blocks.length; i++) {
        if (!this.blocks[i].isMovable) {
          this.updateBlockField(this.blocks[i], 'isMovable', true);
        }
      }
    },
    updateOccupiedCellsIds() {
      this.occupiedCellsIds = this.blocks.map(block => { return block.coords.join('-') });
    },
    isCellOccupied(coords) {
      return this.occupiedCellsIds.includes(coords.join('-'));
    },
    isOutOfMap(coords) {
      return document.getElementById(coords.join('-')) ? false : true;
    },
    getNewBlockPosition(action, direction, block) {
      let newBlock = JSON.parse(JSON.stringify(block));
      if (action === 'push') {
        if (direction === 'down') {
          newBlock.coords[1] += 1;
        } else if (direction === 'left') {
          newBlock.coords[0] -= 1;
        } else if (direction === 'right') {
          newBlock.coords[0] += 1;
        }
      } else if (action === 'rotate') {
        return this.rotateBlock(direction, block);
      }
      return newBlock;
    },
    getMovableBlocks(type) {
      return this.blocks.filter(block => {
        if (type === 'all') {
          return block.isMovable === true
        } else if (type === 'piece') {
          return block.isMovable === true && block.isPiece === true
        } else if (type === 'block') {
          return block.isMovable === true && block.isPiece !== true
        }
      })
    },
    getSortedCoords(a, b, direction) {
      if (direction === 'down') {
        return b.coords[1] - a.coords[1];
      } else if (direction === 'left') {
        return a.coords[0] - b.coords[0];
      } else if (direction === 'right') {
        return b.coords[0] - a.coords[0];
      }
      return 0;
    },
    checkPieceMobility(action, direction, blocks) {
      let checkPassed = true;
      for (let i = 0; i < blocks.length; i++) {
        const newBlock = this.getNewBlockPosition(action, direction, blocks[i]);
        const isOccupied = this.blocks.find(block => {
          return this.compareCoords(block.coords, newBlock.coords) && block.isPiece === false
        });
        if (this.isOutOfMap(newBlock.coords) || isOccupied) {
          checkPassed = false;
          break;
        }
      }
      return checkPassed;
    },
    getRadians(angle) {
      return angle * Math.PI / 180;
    },
    getSin(angle) {
      const radians = this.getRadians(angle);
      return Math.sin(radians);
    },
    getCos(angle) {
      const radians = this.getRadians(angle);
      return Math.cos(radians);
    },
    getSinSign(angle) {
      return Number(this.getSin(angle).toFixed(0));
    },
    getCosSign(angle) {
      return Number(this.getCos(angle).toFixed(0));
    },
    getRotatedCoords(coordsToRotate, centerCoords, angle) {
      const rotatedX = Number((this.getCos(angle) * (coordsToRotate[0] - centerCoords[0]) - this.getSin(angle) * (coordsToRotate[1] - centerCoords[1]) + centerCoords[0]).toFixed(0));
      const rotatedY = Number((this.getSin(angle) * (coordsToRotate[0] - centerCoords[0]) + this.getCos(angle) * (coordsToRotate[1] - centerCoords[1]) + centerCoords[1]).toFixed(0));
      return [rotatedX, rotatedY];
    },
    rotateBlock(direction, block) {
      const rotationAngle = direction === 'left' ? 90 : -90;
      let rotatingBlock = JSON.parse(JSON.stringify(block));
      // Step 1: Rotazione blocco su se stesso
      let coordsToRotate = rotatingBlock.coords;
      let centerCoords = [ coordsToRotate[0] + 0.5, coordsToRotate[1] + 0.5 ];
      let rotatedCoords = this.getRotatedCoords(coordsToRotate, centerCoords, -rotatingBlock.angleDegree);
      // Step 2: Aggiornamento dell'angolo di rotazione del blocco
      rotatingBlock.angleDegree += rotationAngle;
      // Step 3: Rotazione del blocco sulla griglia
      centerCoords = [
        rotatingBlock.relCoords[0] > 0 ? rotatedCoords[0] - rotatingBlock.relCoords[0] : rotatedCoords[0] + Math.abs(rotatingBlock.relCoords[0]),
        rotatingBlock.relCoords[1] > 0 ? rotatedCoords[1] + rotatingBlock.relCoords[1] : rotatedCoords[1] - Math.abs(rotatingBlock.relCoords[1])
      ];
      rotatedCoords = this.getRotatedCoords(rotatedCoords, centerCoords, -rotationAngle);
      // Step 4: Aggiornamento delle coordinate relative del blocco
      rotatingBlock.relCoords = [
        rotatedCoords[0] > centerCoords[0] ? rotatedCoords[0] - centerCoords[0] : -Math.abs(rotatedCoords[0] - centerCoords[0]),
        rotatedCoords[1] > centerCoords[1] ? -Math.abs(rotatedCoords[1] - centerCoords[1]) : Math.abs(rotatedCoords[1] - centerCoords[1])
      ];
      // Step 5: Rotazione inversa del blocco su se stesso
      centerCoords = [ rotatedCoords[0] - 0.5, rotatedCoords[1] - 0.5 ];
      rotatedCoords = this.getRotatedCoords(rotatedCoords, centerCoords, -rotatingBlock.angleDegree);
      rotatingBlock.coords[0] = rotatedCoords[0];
      rotatingBlock.coords[1] = rotatedCoords[1];
      return rotatingBlock;
    },
    rotatePiece(action, direction, type) {
      if (this.gameStatus === 'pause') return;
      const movablePieces = this.getMovableBlocks('piece');
      if (type === 'piece' || type === 'all') {
        const isPieceMovable = this.checkPieceMobility(action, direction, movablePieces);
        if (isPieceMovable) {
          for (let i = 0; i < movablePieces.length; i++) {
            const newBlock = this.getNewBlockPosition(action, direction, movablePieces[i]);
            for (let [key, value] of Object.entries(newBlock)) {
              this.updateBlockField(movablePieces[i], key, value);
            }
            this.updateOccupiedCellsIds();
          }
          this.playAudio(action);
        } else {
          this.playAudio('error');
        }
      }
    },
    moveBlocks(action, direction, type) {
      if (this.gameStatus === 'pause') return;
      if (type === 'row' || type === 'all') {
        let canRowSlide = false;
        for (let i = this.gridSize[1] - 1; i > -1; i--) {
          if (canRowSlide) {
            const movableRow = this.blocks.filter(block => {
              return block.coords[1] === i && block.isPiece === false
            });
            for (let i = 0; i < movableRow.length; i++) {
              const newBlock = this.getNewBlockPosition(action, direction, movableRow[i]);
              for (let [key, value] of Object.entries(newBlock)) {
                this.updateBlockField(movableRow[i], key, value);
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
      }

      const movablePieces = this.getMovableBlocks('piece').sort((a, b) => {
        return this.getSortedCoords(a, b, direction);
      });
      if (type === 'piece' || type === 'all') {
        const isPieceMovable = this.checkPieceMobility(action, direction, movablePieces);
        if (isPieceMovable) {
          const hasMovablePieces = movablePieces.length;
          for (let i = 0; i < hasMovablePieces; i++) {
            const newBlock = this.getNewBlockPosition(action, direction, movablePieces[i]);
            for (let [key, value] of Object.entries(newBlock)) {
              this.updateBlockField(movablePieces[i], key, value);
            }
            this.updateOccupiedCellsIds();
          }
          if (hasMovablePieces) {
            if (movablePieces[0].isMovable && direction === 'down' && type === 'piece') {
              this.updateScore('push');
            }
          }
          this.playAudio('push');
        } else if (direction === 'down') {
          for (let i = 0; i < movablePieces.length; i++) {
            this.updateBlockField(movablePieces[i], 'isMovable', false);
            this.updateBlockField(movablePieces[i], 'isPiece', false);
          }
          this.updateOccupiedCellsIds();
        }
      }
    },
    pushBlocks(action, direction, type) {
      this.moveBlocks(action, direction, type);
    },
    getRandomNumInRange(min, max) {
      const randomNumber = Math.floor(Math.random() * (max - min) + min);
      return randomNumber;
    },
    addShape(shape) {
      this.blocks.push(...shape);
      this.shapesList.shift();
    },
    updateTimer(levelId) {
      const velocity = gameLevels.levels.find(level => { return level.id === levelId }).velocity;
      this.timer = setInterval(() => {
        this.timeTick += ( velocity / 1000 );
      }, velocity);
    },
    getCellId(value) {
      return Math.floor(value % this.gridSize[0]) + '-' + Math.floor(value / this.gridSize[0])
    },
    getActiveCells(id) {
      if (this.activeCells.find(cell => { return cell.coords === id })) return true;
      return false;
    },
  },
  computed: {
    squareSize() {
      return this.gridWidth / this.gridSize[0];
    },
    seconds() {
      return this.timeTick.toFixed(0);
    },
    levelLabel() {
      return gameLevels.levels.find(level => { return level.id === this.level }).label;
    },
  }
}
</script>

<style lang="scss">
@import './assets/styles/app.scss';
</style>
