function spawnOG(){
    let bug = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 2 2 2 2 2 2 2 2 2 2 2 . .
        . . . . . . . . . . . . . . . .
    `,SpriteKind.Player)
    sprites.setDataNumber(bug, "speed", randint(40, 60))
    sprites.setDataNumber(bug, "hunger",100)
    sprites.setDataNumber(bug, "sight", randint(70, 85))
    if (sprites.readDataNumber(bug, "sight")>= 75){
        
        sprites.setDataNumber(bug, "speed", sprites.readDataNumber(bug, "speed") - sprites.readDataNumber(bug, "speed")/10)
    } else if (sprites.readDataNumber(bug, "speed") >= 50 ){
        sprites.setDataNumber(bug, "sight", sprites.readDataNumber(bug, "sight") - sprites.readDataNumber(bug, "sight") / 10)
    }
}
spawnOG()
game.onUpdateInterval(4000, function() {
    for (let element of sprites.allOfKind(SpriteKind.Player)) {
        if (sprites.readDataNumber(element, "hunger") > 30){
            walk(element)
        } else if (sprites.readDataNumber(element, "hunger") <= 30 && sprites.readDataNumber(element, "hunger") > 0){
            walkToFood(element)
        }
    }
})
game.onUpdateInterval(1000, function () {
    for (let element of sprites.allOfKind(SpriteKind.Player)) {
        sprites.setDataNumber(element, "hunger", sprites.readDataNumber(element, "hunger")-
            sprites.readDataNumber(element, "speed")/10)
        if (element.vx == 0 && element.vy == 0){
            sprites.setDataNumber(element, "hunger", sprites.readDataNumber(element, "hunger") -
                sprites.readDataNumber(element, "speed") / 15)
        }
        element.sayText(sprites.readDataNumber(element, "speed").toString() + " SPD " + sprites.readDataNumber(element, "sight").toString() + " ST " +sprites.readDataNumber(element, "hunger").toString()+ " HGR ")
        if (sprites.readDataNumber(element, "hunger") <= 30 && sprites.readDataNumber(element, "hunger") > 0) {
            walkToFood(element)
        }
    }
})
function walk(spritetomove:Sprite){
   let targetPOS = sprites.create(img`
       . . . . . . . . . . . . . . . .
       . . . . 8 8 8 8 8 8 8 . . . . .
       . . 8 8 . . . 8 . . . 8 8 . . .
       . 8 . . . . . 8 . . . . . 8 . .
       . 8 . . . . . 8 . . . . . 8 . .
       8 . . . . . . 8 . . . . . . 8 .
       8 . . . . . . 8 . . . . . . 8 .
       8 . . . . . . 8 . . . . . . 8 .
       8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 .
       8 . . . . . . 8 . . . . . . 8 .
       8 . . . . . . 8 . . . . . . 8 .
       8 . . . . . . 8 . . . . . . 8 .
       . 8 . . . . . 8 . . . . . 8 . .
       . 8 . . . . . 8 . . . . . 8 . .
       . . 8 8 . . . 8 . . . 8 8 . . .
       . . . . 8 8 8 8 8 8 8 . . . . .
   `,SpriteKind.Projectile)
    targetPOS.setPosition(randint(spritetomove.x + sprites.readDataNumber(spritetomove, "sight"), spritetomove.x - sprites.readDataNumber(spritetomove, "sight")), randint(spritetomove.y + sprites.readDataNumber(spritetomove, "sight"), spritetomove.y - sprites.readDataNumber(spritetomove, "sight")))
    spritetomove.follow(targetPOS, sprites.readDataNumber(spritetomove, "speed"))
    scene.cameraFollowSprite(spritetomove)
    
}
function walkToFood(spritetomove:Sprite){
    for (let element of sprites.allOfKind(SpriteKind.Food)) {
        let sightRadius = sprites.readDataNumber(spritetomove,"sight")
        if (isSpriteInRadius(spritetomove, element, sightRadius)) {
            spritetomove.follow(element, sprites.readDataNumber(spritetomove, "speed"))
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function(sprite: Sprite, otherSprite: Sprite) {
    otherSprite.destroy()
    sprites.setDataNumber(sprite, "hunger", sprites.readDataNumber(sprite, "hunger") +
        10)
})
game.onUpdateInterval(3500, function() {
    let food = sprites.create(img`
        . . . . . . . e c 7 . . . . . .
        . . . . e e e c 7 7 e e . . . .
        . . c e e e e c 7 e 2 2 e e . .
        . c e e e e e c 6 e e 2 2 2 e .
        . c e e e 2 e c c 2 4 5 4 2 e .
        c e e e 2 2 2 2 2 2 4 5 5 2 2 e
        c e e 2 2 2 2 2 2 2 2 4 4 2 2 e
        c e e 2 2 2 2 2 2 2 2 2 2 2 2 e
        c e e 2 2 2 2 2 2 2 2 2 2 2 2 e
        c e e 2 2 2 2 2 2 2 2 2 2 2 2 e
        c e e 2 2 2 2 2 2 2 2 2 2 4 2 e
        . e e e 2 2 2 2 2 2 2 2 2 4 e .
        . 2 e e 2 2 2 2 2 2 2 2 4 2 e .
        . . 2 e e 2 2 2 2 2 4 4 2 e . .
        . . . 2 2 e e 4 4 4 2 e e . . .
        . . . . . 2 2 e e e e . . . . .
    `,SpriteKind.Food)

    tiles.placeOnRandomTile(food, assets.tile`tileGrass3`)
})
tiles.setCurrentTilemap(tilemap`level1`)
function isSpriteInRadius(spriteA: Sprite, spriteB: Sprite, radius: number): boolean {
    let dx = spriteA.x - spriteB.x
    let dy = spriteA.y - spriteB.y
    let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    return distance <= radius
}
scene.onHitWall(SpriteKind.Projectile, function(sprite: Sprite, location: tiles.Location) {
    sprites.destroy(sprite)
})