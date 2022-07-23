export default {
    soundPaths: {
        backgroundMusic: new Audio(require('/src/static/sounds/music.wav')),
        moveBlock: new Audio(require('/src/static/sounds/move_blocks.wav')),
        rotateBlock: new Audio(require('/src/static/sounds/rotate_piece.wav')),
        score: new Audio(require('/src/static/sounds/score.wav')),
        pauseGame: new Audio(require('/src/static/sounds/pause.wav')),
        continueGame: new Audio(require('/src/static/sounds/continue.wav')),
        loseGame: new Audio(require('/src/static/sounds/lose.wav')),
        error: new Audio(require('/src/static/sounds/error.wav')),
        levelUp: new Audio(require('/src/static/sounds/level_up.wav')),
    }
}