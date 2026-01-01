function async_loop(action, times, delay, callback) {
    function step(idx) {
        return function() {
            action(idx)
            
            if (idx < times)
                setTimeout(step(idx + 1), delay)
            else
                callback()
        }
    }
    
    step(0)()
}

function enwhite(obj, step, steps) {
    const white = step * 1.0 / steps
    obj.style.backgroundColor = `rgba(255, 255, 255, ${white})`
}

function moveObject({obj, x1, y1, x2, y2}, step, steps) {
    const left = x1 + step * (x2 - x1) / steps
    const top  = y1 + step * (y2 - y1) / steps
                
    obj.style.left = `${left}px`
    obj.style.top = `${top}px`
}

function rnd(l, r) {
    return l + Math.round(Math.random() * (r - l))
}

function genAside(width, height) { // generate pair 
    const pos = Math.random()
    let left
    let top
    if (pos < 0.25) { // behind left
        left = -375
        top = rnd(-500, height)
    } else if (pos < 0.5) { // behind right
        left = width + 125
        top = rnd(-500, height)
    } else if (pos < 0.75) { // behing top
        top = -500
        left = rnd(-250, width)
    } else { // behind bottom
        top = height
        left = rnd(-250, width)
    }
    return [left, top]
}


function showKzyf() {
    const canvas = document.createElement("div")
    canvas.className = "canvas__kzyf canvas"
    document.body.appendChild(canvas)
    
    const bird1 = document.createElement("div")
    bird1.className = "bird left"
    
    const bird2 = document.createElement("div")
    bird2.className = "bird right"
    
    canvas.appendChild(bird1)
    canvas.appendChild(bird2)
    
    const width = window.innerWidth
    const height = window.innerHeight
    const h_pos = height / 2 - 320
    
    const STEPS = 200
    const STEP_DELAY = 20
    
    async_loop(
        function(step) {
            if (step == 190) {
                document.getElementById("village").pause()
                document.getElementById("scream").play()
            }
            moveObject({obj: bird1, x1: -640,  y1: h_pos, x2: width / 2 - 620, y2: h_pos}, step, STEPS)
            moveObject({obj: bird2, x1: width, y1: h_pos, x2: width / 2 - 20,  y2: h_pos}, step, STEPS)
            enwhite(canvas, step, STEPS)
        },
        STEPS,
        STEP_DELAY,
        function() {
            setTimeout(function() {
                document.location.href = "https://aciso.ru"
            }, 300)
        }
    )
}



function showRucya() {
    const canvas = document.createElement("div")
    canvas.className = "canvas canvas__rucya"
    
    document.body.appendChild(canvas)
    
    const RUCYA_CNT = 100
    const STEP_DELAY = 20
    const STEPS = 80
    const RUCYA_DELAY_STEPS = 5
    
    const width = window.innerWidth
    const height = window.innerHeight
    
    let rucyas = []
    
    for (let i = 0; i < RUCYA_CNT; i++) {
        const rucya = document.createElement("div")
        rucya.className = "rucya"
        
        canvas.appendChild(rucya)
        
        const [x1, y1] = genAside(width, height)
        
        const x2 = rnd(-125, width)
        const y2 = rnd(-250, height)
        
        const angle = Math.atan2(y2 - y1, x2 - x1)
        let degrees = Math.round(180 * angle / Math.PI)
        
        if (Math.abs(degrees) > 90) {
            degrees = Math.sign(degrees) * 180 - degrees
            rucya.style.transform = `scale(-1, 1) rotate(${degrees}deg)`
        } else {
            rucya.style.transform = `rotate(${degrees}deg)`
        }   
        
        rucyas.push({obj: rucya, x1, y1, x2, y2})
    }

    document.getElementById("village").play()
    
    async_loop(
        function(step) {
            for (let i = 0; i < RUCYA_CNT; i++) {
                const rucya = rucyas[i]
                const rstep = Math.min(STEPS, Math.max(0, step - i * RUCYA_DELAY_STEPS))
                
                moveObject(rucya, rstep, STEPS)
            }
        },
        RUCYA_CNT * RUCYA_DELAY_STEPS + STEPS,
        STEP_DELAY,
        showKzyf
    )
}

window.onload = function() {
    document.getElementById("ignore").addEventListener("click", function() {
        document.querySelector(".protect").style.display = "none"
        setTimeout(showRucya, 10000)
    })
}

