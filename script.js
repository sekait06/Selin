const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')


canvas.width = innerWidth
canvas.height = innerHeight

//  "Hallo"
// "Hallo again"
// "Mason was here ( ͠° ͜ʖ ͠° )"

class Boundary{
    static width = 40
    static height = 40
    constructor({position, image}){
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw(){
        //c.fillStyle = 'blue'
        //c.fillRect(this.position.x , this.position.y , this.width , this.height)
        c.drawImage(this.image , this.position.x , this.position.y)
    }
}

class Player{
    constructor({
                    position, velocity
                }){
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x , this.position.y , this.radius, 0 , Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Ghost{
    static speed = 2
    constructor({
                    position, velocity, color = 'red'
                }){
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x , this.position.y , this.radius, 0 , Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Pellet{
    constructor({
                    position
                }){
        this.position = position
        this.radius = 3
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x , this.position.y , this.radius, 0 , Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

class PowerUp{
    constructor({
                    position
                }){
        this.position = position
        this.radius = 8
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x , this.position.y , this.radius, 0 , Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

const pellets = []
const boundaries = []
const powerUps = []
const ghosts  = [
    new Ghost({
        position: {
            x : Boundary.width * 7 + Boundary.width / 2,
            y : Boundary.height + Boundary.height /2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),

    new Ghost({
        position: {
            x : Boundary.width * 7 + Boundary.width / 2,
            y : Boundary.height * 3 + Boundary.height /2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    }),
    new Ghost({
        position: {
            x : Boundary.width * 7 + Boundary.width / 2,
            y : Boundary.height * 3 + Boundary.height /2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'purple'
    })

]

const player = new Player({
    position: {
        x : Boundary.width + Boundary.width / 2,
        y : Boundary.height + Boundary.height /2
    },
    velocity: {
        x : 0,
        y : 0
    }
    // "Comment"
})

const keys = {
    w : {
        pressed : false
    },
    a : {
        pressed : false
    },
    s : {
        pressed : false
    },
    d : {
        pressed : false
    }

}

let lastKey = ''
let score = 0
const map = [
    [ '1' , '-' , '-' , '-' , '-' , '-' , '-' , '-' , '-' , '-' , '2'],
    [ '|' , '?' , '?' , '?' , '?' , '?' , '?' , '?' , '?' , '?' , '|'],
    [ '|' , '?' , '[' , ']' , '?' , 'b' , '?' , '[' , ']' , '?' , '|'],
    [ '|' , '?' , '?' , '?' , '?' , '?' , '?' , '?' , '?' , '?' , '|'],
    [ '|' , '?' , '^' , '?' , '1' , ']' , '?' , '[' , '2' , '?' , '|'],
    [ '|' , '?' , '|' , '?' , '.' , '?' , '?' , '?' , '.' , '?' , '|'],
    [ '|' , '?' , '|' , '?' , '?' , '?' , '^' , '?' , '?' , '?' , '|'],
    [ '|' , '?' , '4' , ']' , '?' , '[' , ')' , '?' , 'b' , '?' , '|'],
    [ '|' , '?' , '?' , '?' , '?' , '?' , '.' , '?' , '?' , '?' , '|'],
    [ '|' , '?' , '^' , '?' , '^' , '?' , '?' , '?' , '^' , '?' , '|'],
    [ '|' , '?' , '.' , '?' , '4' , ']' , '?' , '[' , '3' , '?' , '|'],
    [ '|' , '?' , '?' , '?' , '?' , '?' , '?' , '?' , '?' , 'p' , '|'],
    [ '4' , '-' , '-' , '-' , '-' , '-' , '-' , '-' , '-' , '-' , '3']
]
function createImage(src){
    const image = new Image()
    image.src = src
    return image
}

map.forEach((row, i) => {
    row.forEach((symbol , j) =>{
        switch (symbol){
            case '-':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeHorizontal.png')
                    })
                )
                break
            case '|':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeVertical.png')
                    })
                )
                break
            case '1':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeCorner1.png')
                    })
                )
                break
            case '2':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeCorner2.png')
                    })
                )
                break
            case '3':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeCorner3.png')
                    })
                )
                break
            case '4':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeCorner4.png')
                    })
                )
                break
            case 'b':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/block.png')
                    })
                )
                break
            case '.':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/capBottom.png')
                    })
                )
                break
            case '^':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/capTop.png')
                    })
                )
                break
            case '[':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/capLeft.png')
                    })
                )
                break
            case ']':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/capRight.png')
                    })
                )
                break
            case ':':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeConnectorRight.png')
                    })
                )
                break
            case '+':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeCross.png')
                    })
                )
                break
            case ')':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeConnectorLeft.png')
                    })
                )
                break
            case '*':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeConnectorTop.png')
                    })
                )
                break
            case ',':
                boundaries.push(
                    new Boundary({
                        position:{
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image : createImage('./img/pipeConnectorBottom.png')
                    })
                )
                break
            case '?':
                pellets.push(
                    new Pellet({
                        position:{
                            x: Boundary.width * j + Boundary.width/2,
                            y: Boundary.height * i + Boundary.height/2
                        },
                    })
                )
                break

            case 'p':
                powerUps.push(
                    new PowerUp({
                        position:{
                            x: Boundary.width * j + Boundary.width/2,
                            y: Boundary.height * i + Boundary.height/2
                        },
                    })
                )
                break
            case ' ' :
                break
        }
    })
})

function circleCollidesWithRectangle({
                                         circle,
                                         rectangle
                                     }) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y
        <=
        rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x
        >=
        rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y
        >=
        rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x
        <=
        rectangle.position.x + rectangle.width + padding
    )
}


let animationID
function animate(){
    animationID  = requestAnimationFrame(animate)
    c.clearRect(0 , 0 , canvas.width , canvas.height)

    if (keys.w.pressed && lastKey === 'w'){
        for (let i = 0 ; i < boundaries.length ; i++){
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle : {
                        ...player,
                        velocity:{
                            x : 0,
                            y : -5
                        }
                    },
                    rectangle : boundary
                })
            )   {
                player.velocity.y = 0
                break
            }else {
                player.velocity.y = -5
            }
        }

    } else if ( keys.a.pressed && lastKey === 'a'){
        for (let i = 0 ; i < boundaries.length ; i++){
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle : {
                        ...player,
                        velocity:{
                            x : -5,
                            y : 0
                        }
                    },
                    rectangle : boundary
                })
            )   {
                player.velocity.x = 0
                break
            }else {
                player.velocity.x = -5
            }
        }
    }else if (keys.s.pressed && lastKey === 's'){
        for (let i = 0 ; i < boundaries.length ; i++){
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle : {
                        ...player,
                        velocity:{
                            x : 0,
                            y : 5
                        }
                    },
                    rectangle : boundary
                })
            )   {
                player.velocity.y = 0
                break
            }else {
                player.velocity.y = 5
            }
        }
    }else if (keys.d.pressed && lastKey === 'd'){
        for (let i = 0 ; i < boundaries.length ; i++){
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle : {
                        ...player,
                        velocity:{
                            x : 5,
                            y : 0
                        }
                    },
                    rectangle : boundary
                })
            )   {
                player.velocity.x = 0
                break
            }else {
                player.velocity.x = 5
            }
        }
    }


    // detect collision between player and ghosts
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
        // ghosts touch player

        if (Math.hypot(ghost.position.x-player.position.x,
                ghost.position.y-player.position.y
            ) <
            ghost.radius+player.radius
        ) {
            // if we touching scared ghost remove it from game
            if (ghost.scared){
                ghosts.splice(i, 1)
            }else{
                cancelAnimationFrame(animationID)
                console.log('you lose!')
            }
        }

    }
    // player collides with powerup
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()

        if (Math.hypot(
                powerUp.position.y-player.position.y,
                powerUp.position.x-player.position.x,
            ) <
            powerUp.radius+player.radius
        ) {
            powerUps.splice(i, 1)
            // make ghosts scared
            ghosts.forEach(ghost=>{
                ghost.scared = true

                setTimeout(()=> {
                    ghost.scared = false
                }, 5000)
            })
        }
    }

//touch pallets here
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (Math.hypot(pellet.position.x-player.position.x, pellet.position.y-player.position.y) < pellet.radius+player.radius) {
            console.log('touching')
            pellets.splice(i, 1)
            score +=10
            scoreEl.innerHTML = score
        }
    }

    boundaries.forEach((boundary)=>{
        boundary.draw()

        if (
            circleCollidesWithRectangle({
                circle : player,
                rectangle : boundary
            })
        ){
            player.velocity.x = 0
            player.velocity.y = 0
        }

    })

    player.update()

    ghosts.forEach(ghost => {
        ghost.update()


        const collisions = []
        boundaries.forEach(boundary => {
            if (
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle : {
                        ...ghost,
                        velocity:{
                            x : 5,
                            y : 0
                        }
                    },
                    rectangle : boundary
                })
            ) {
                collisions.push('right')
            }
            if (
                !collisions.includes('left') &&
                circleCollidesWithRectangle({
                    circle : {
                        ...ghost,
                        velocity:{
                            x : -5,
                            y : 0
                        }
                    },
                    rectangle : boundary
                })
            ) {
                collisions.push('left')
            }
            if (
                !collisions.includes('up') &&
                circleCollidesWithRectangle({
                    circle : {
                        ...ghost,
                        velocity:{
                            x : 0,
                            y : -5
                        }
                    },
                    rectangle : boundary
                })
            ) {
                collisions.push('up')
            }
            if (
                !collisions.includes('down') &&
                circleCollidesWithRectangle({
                    circle : {
                        ...ghost,
                        velocity:{
                            x : 0,
                            y : 5
                        }
                    },
                    rectangle : boundary
                })
            ) {
                collisions.push('down')
            }
        })
        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions
        }
        if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
            if(ghost.velocity.x > 0) {
                ghost.prevCollisions.push('right')
            }else if(ghost.velocity.x < 0) {
                ghost.prevCollisions.push('left')
            } else if(ghost.velocity.y < 0) {
                ghost.prevCollisions.push('up')
            }else if(ghost.velocity.y > 0) {
                ghost.prevCollisions.push('down')
            }

            const pathways = ghost.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            switch (direction) {
                case 'down':
                    ghost.velocity.y  = ghost.speed
                    ghost.velocity.x  = 0
                    break
                case 'up':
                    ghost.velocity.y  = -ghost.speed
                    ghost.velocity.x  = 0
                    break
                case 'right':
                    ghost.velocity.y  = 0
                    ghost.velocity.x  = ghost.speed
                    break
                case 'left':
                    ghost.velocity.y  = 0
                    ghost.velocity.x  = -ghost.speed
                    break
            }

            ghost.prevCollisions = []
        }
    })
}

animate()

window.addEventListener('keydown', ({key})=>{

    switch ( key ){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', ({key})=>{

    switch ( key ){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
    console.log(player.velocity)

})