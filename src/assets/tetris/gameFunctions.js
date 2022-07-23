import gameSounds from './gameSounds.js';
import gameLevels from './gameLevels.js';
import gamePieces from './gamePieces.js';
import gameThemes from './gameThemes.js';
export default {
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
    getRandomNumInRange(min, max) {
        const randomNumber = Math.floor(Math.random() * (max - min) + min);
        return randomNumber;
    },
    getRotatedCoords(coordsToRotate, centerCoords, angle) {
        const rotatedX = Number((this.getCos(angle) * (coordsToRotate[0] - centerCoords[0]) - this.getSin(angle) * (coordsToRotate[1] - centerCoords[1]) + centerCoords[0]).toFixed(0));
        const rotatedY = Number((this.getSin(angle) * (coordsToRotate[0] - centerCoords[0]) + this.getCos(angle) * (coordsToRotate[1] - centerCoords[1]) + centerCoords[1]).toFixed(0));
        return [rotatedX, rotatedY];
    },
    getPointerResult(pointerPos) {
        const deltaX = pointerPos.startingCoords[0] - pointerPos.finalCoords[0];
        const deltaY = pointerPos.startingCoords[1] - pointerPos.finalCoords[1];
        const ratioXY = deltaX / deltaY;
        const errorRange = 25;
        if (deltaX > -errorRange && deltaX < errorRange && deltaY > -errorRange && deltaY < errorRange) {
            return ['rotate', 'right', 'piece'];
        } else if (ratioXY < 1 && ratioXY > -1 && deltaY < 0) {
            return ['push', 'down', 'piece'];
        } else if (deltaX <= 0) {
            return ['push', 'right', 'piece'];
        } else if (deltaX > 0) {
            return ['push', 'left', 'piece'];
        }
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
    compareCoords(aCoords, bCoords) {
        return (aCoords[0] === bCoords[0] && aCoords[1] === bCoords[1]) ? true : false;
    },
    generateShape() {
        return JSON.parse(JSON.stringify(
            gamePieces.pieces[this.getRandomNumInRange(0, gamePieces.pieces.length)]
        ));
    },
    canShapeBeAdded(newShape, occupiedCellsIds) {
        const duplicatedCells = newShape.filter(block => {
            return occupiedCellsIds.includes(block.coords.join('-'))
        });
        return duplicatedCells.length === 0;
    },
    getHighscore(score, bestScore) {
        return score >= bestScore ? score : bestScore;
    },
    checkPieceMobility(action, direction, blocksToMove, allBlocks) {
        let checkPassed = true;
        for (let i = 0; i < blocksToMove.length; i++) {
            const newBlock = this.getNewBlockPosition(action, direction, blocksToMove[i]);
            if (this.isOutOfMap(newBlock.coords) || this.isBlockOccupied(allBlocks, newBlock.coords)) {
                checkPassed = false;
                break;
            }
        }
        return checkPassed;
    },
    getMovableBlocks(type, blocks) {
        return blocks.filter(block => {
            if (type === 'all') {
                return block.isMovable === true
            } else if (type === 'piece') {
                return block.isMovable === true && block.isPiece === true
            } else if (type === 'block') {
                return block.isMovable === true && block.isPiece !== true
            }
        })
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
    getTheme(value) {
        return gameThemes.themes[value];
    },
    getLevelLabel(levelNumber) {
        return gameLevels.levels.find(level => { return level.id === levelNumber }).label;
    },
    getVelocity(levelId) {
        return gameLevels.levels.find(level => { return level.id === levelId }).velocity;
    },
    updateBlockField(blockObj, key, value) {
        return blockObj[key] = value;
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
    updateOccupiedCellsIds(occupiedCellsIds, blocks) {
        return occupiedCellsIds = blocks.map(block => { return block.coords.join('-') });
    },
    pushRows(action, direction, gridSize, occupiedCellsIds, blocks) {
        let canRowSlide = false;
        for (let i = gridSize[1] - 1; i > -1; i--) {
            if (canRowSlide) {
                const movableRow = blocks.filter(block => {
                return block.coords[1] === i && block.isPiece === false
            });
                for (let i = 0; i < movableRow.length; i++) {
                    const newBlock = this.getNewBlockPosition(action, direction, movableRow[i]);
                    for (let [key, value] of Object.entries(newBlock)) {
                        this.updateBlockField(movableRow[i], key, value);
                    }
                    this.updateOccupiedCellsIds(occupiedCellsIds, blocks);
                }
            }
            const row = blocks.filter(block => {
                return block.coords[1] === i
            });
            if (!row.length) {
                canRowSlide = true;
            }
        }
    },
    playAudio(action) {
        if (action === 'rotate') {
            gameSounds.soundPaths.rotateBlock.play();
        } else if (action === 'push') {
            gameSounds.soundPaths.moveBlock.play();
        } else if (action === 'score') {
            gameSounds.soundPaths.score.play();
        } else if (action === 'start') {
            gameSounds.soundPaths.backgroundMusic.loop = true;
            gameSounds.soundPaths.backgroundMusic.currentTime = 0;
            gameSounds.soundPaths.backgroundMusic.play();
        } else if (action === 'lose') {
            gameSounds.soundPaths.backgroundMusic.pause();
            gameSounds.soundPaths.loseGame.play();
        } else if (action === 'pause') {
            gameSounds.soundPaths.backgroundMusic.pause();
            gameSounds.soundPaths.pauseGame.play();
        } else if (action === 'continue') {
            gameSounds.soundPaths.continueGame.play();
            gameSounds.soundPaths.backgroundMusic.play();
        } else if (action === 'error') {
            gameSounds.soundPaths.error.play();
        } else if (action === 'backgroundMusic') {
            gameSounds.soundPaths.backgroundMusic.muted = !gameSounds.soundPaths.backgroundMusic.muted;
        } else if (action === 'effects') {
            for (let key of Object.entries(gameSounds.soundPaths)) {
                if (key[0] === 'backgroundMusic') continue;
                gameSounds.soundPaths[key[0]].muted = !gameSounds.soundPaths[key[0]].muted;
            }
        } else if (action === 'levelUp') {
            gameSounds.soundPaths.levelUp.play();
        }
    },
    addScore(type) {
        if (type === 'row') {
            return 100;
        } else if (type === 'push') {
            return 10;
        }
    },
    isMobile() {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) < 768;
    },
    hasPieceOnMap(blocks) {
        return blocks.find(block => { return block.isPiece });
    },
    hasLeveledUp(actualLevel) {
        const level = gameLevels.levels.find(level => { return level.id === (actualLevel + 1) });
        return level ? true : false;
    },
    isBlockOccupied(blocks, coordsToVerify) {
        return blocks.find(block => {
            return this.compareCoords(block.coords, coordsToVerify) && block.isPiece === false
        });
    },
    isOutOfMap(coords) {
        return document.getElementById(coords.join('-')) ? false : true;
    },
}