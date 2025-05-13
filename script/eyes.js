import { debounce, initBackground } from "./main.js"

const combinations = [
    { i: 60, p: 10 },
    { i: 80, p: 10 },
    { i: 80, p: 30 },
    { i: 80, p: 50 },
    { i: 100, p: 10 },
    { i: 100, p: 30 },
    { i: 100, p: 50 }
]
const colors = [
    '#F98948',
    '#0CCE6B',
    '#DCED31',
]

const allEyes = []

export function createEye(i) {
    const eyeBalise = document.createElement('object')
    eyeBalise.data = "./static/assets/eye.svg"
    eyeBalise.type = 'image/svg+xml'
    eyeBalise.classList.add("eye")
    eyeBalise.id = `e${i}`
    return eyeBalise
}

export function randomizeEye(eyeBalise) {
    eyeBalise.addEventListener('load', () => {
        const svgDoc = eyeBalise.contentDocument
        const all = svgDoc.getElementById('all')
        const iris = svgDoc.getElementById('iris')
        const pupil = svgDoc.getElementById('pupil')

        const limits = {
            overflowMargin: 0.1, 
            minSize: 0.20,
            maxSize: 0.35,
            rotationRange: 90,
        }
        const viewportWidth = document.documentElement.clientWidth
        const viewportHeight = document.body.scrollHeight * 0.9
        const size = Math.floor(viewportWidth * (Math.random() * (limits.maxSize - limits.minSize) + limits.minSize))
        const overflowX = viewportWidth * limits.overflowMargin
        
        eyeBalise.style.left = `${Math.floor(Math.random() * (viewportWidth + overflowX / 2) - overflowX)}px`
        eyeBalise.style.top = `${Math.floor(Math.random() * viewportHeight)}px`
        eyeBalise.style.width = `${size}px`
        eyeBalise.style.height = `${size}px`

        cx = eyeBalise.style.left + eyeBalise.style.width / 2
        cy = eyeBalise.style.right + eyeBalise.style.height / 2
        ray = eyeBalise.style.height * 0.8

        /* allEyes.forEach(eyeHitbox => {
            if (eyeHitbox.r + ray >= (cx - eyeHitbox.x) ** 2 +(cy - eyeHitbox.y) ** 2) {
                eyeBalise.style.left = `${Math.floor(Math.random() * (viewportWidth + overflowX / 2) - overflowX)}px`
                eyeBalise.style.top = `${Math.floor(Math.random() * viewportHeight)}px`
                eyeBalise.style.width = `${size}px`
                eyeBalise.style.height = `${size}px`
        
                cx = eyeBalise.style.left + eyeBalise.style.width / 2
                cy = eyeBalise.style.right + eyeBalise.style.height / 2
                ray = eyeBalise.style.height * 0.8
            }
    
        }) */

        eyeBalise.style.rotate = `${Math.floor(Math.random() * limits.rotationRange * 2) - limits.rotationRange}deg`

        const rdmColor = colors[Math.floor(Math.random() * colors.length)]
        const rdmSize = combinations[Math.floor(Math.random() * combinations.length)]

        all.setAttribute('stroke', rdmColor)
        pupil.setAttribute('fill', rdmColor)
        iris.setAttribute('r', rdmSize.i)
        pupil.setAttribute('r', rdmSize.p)

        allEyes.push({x : cx, y : cy, r : ray})
    })
}

export function eyeEvents() {
    document.addEventListener("mousemove", function (e) {
        console.log(e.clientX, e.clientY) 
        // T'ES ICI FDP
    })
    window.addEventListener("resize", debounce(initBackground, 500))
}
