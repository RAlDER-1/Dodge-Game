// --------------------------------------
// GLOBAL VARIABLES
// --------------------------------------
let playerX = 2
let playerY = 4
let delay_before_movement = 500
let score = 0
let waveHits = 0
let start_game = 0

let obstacles: game.LedSprite[] = []
let obstacleY: number[] = []
let Player: game.LedSprite = null


// --------------------------------------
// RESET GAME
// --------------------------------------
function resetDodgeGame() {

    // Show intro icon
    basic.showLeds(`
        . . # . .
        . # # # .
        # # # # #
        . # # # .
        . . # . .
    `)
    basic.pause(300)

    // Countdown
    basic.clearScreen()
    basic.showString("3")
    basic.showString("2")
    basic.showString("1")
    basic.clearScreen()
    basic.pause(150)

    // Reset states
    playerX = 2
    delay_before_movement = 500
    score = 0
    waveHits = 0

    // Remove old player
    if (Player) {
        Player.delete()
    }

    // Create player
    Player = game.createSprite(playerX, playerY)

    // Clear old obstacles
    for (let obs of obstacles) obs.delete()
    obstacles = []
    obstacleY = []

    // Create 3 falling obstacles
    for (let i = 0; i < 3; i++) {
        let ox = Math.randomRange(0, 4)
        let obs = game.createSprite(ox, 0)
        obstacles.push(obs)
        obstacleY.push(0)
    }

    start_game = 1
}


// --------------------------------------
// PLAYER MOVEMENT
// --------------------------------------
function movePlayer(newX: number) {
    playerX = newX
    Player.set(LedSpriteProperty.X, playerX)
}


// --------------------------------------
// USER INPUT
// --------------------------------------
input.onButtonPressed(Button.A, function () {
    if (playerX > 0) movePlayer(playerX - 1)
})

input.onButtonPressed(Button.B, function () {
    if (playerX < 4) movePlayer(playerX + 1)
})


// --------------------------------------
// START GAME
// --------------------------------------
resetDodgeGame()


// --------------------------------------
// MAIN GAME LOOP
// --------------------------------------
basic.forever(function () {

    if (start_game == 1) {

        for (let j = 0; j < obstacles.length; j++) {

            // Move obstacle down
            obstacleY[j]++
            obstacles[j].set(LedSpriteProperty.Y, obstacleY[j])

            // --------------------------------------
            // RECYCLE OBSTACLE WHEN IT HITS BOTTOM
            // --------------------------------------
            if (obstacleY[j] > 4) {

                // Increase difficulty
                delay_before_movement = Math.max(200, delay_before_movement - 10)
                waveHits++

                // Award points per full wave
                if (waveHits == obstacles.length) {
                    score += 5
                    waveHits = 0
                }

                // Hide obstacle before repositioning
                obstacles[j].set(LedSpriteProperty.Brightness, 0)

                // New random X
                let newX = Math.randomRange(0, 4)
                obstacles[j].set(LedSpriteProperty.X, newX)

                // Reset Y
                obstacleY[j] = 0
                obstacles[j].set(LedSpriteProperty.Y, 0)

                // Show again
                obstacles[j].set(LedSpriteProperty.Brightness, 255)
            }

            // --------------------------------------
            // COLLISION DETECTION
            // --------------------------------------
            if (
                obstacleY[j] == playerY &&
                obstacles[j].get(LedSpriteProperty.X) == playerX
            ) {
                start_game = 0

                // Explosion graphic
                basic.showLeds(`
                    . # . # .
                    # # # # #
                    # # # # #
                    . # # # .
                    . . # . .
                `)
                basic.clearScreen()

                // Cleanup
                Player.delete()
                for (let obs of obstacles) obs.delete()
                obstacles = []

                // Show score and restart
                basic.showString("SCORE: " + score)
                basic.pause(800)
                resetDodgeGame()
            }
        }

        basic.pause(delay_before_movement)
    }
})
