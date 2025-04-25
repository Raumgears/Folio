import { debounce } from "./main.js"

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

function createEye(i) {
    const eyeBalise = document.createElement('object')
    eyeBalise.data = "./static/assets/eye.svg"
    eyeBalise.type = 'image/svg+xml'
    eyeBalise.classList.add("eye")
    eyeBalise.id = `e${i}`
    return eyeBalise
}

function randomizeEye(eyeBalise) {
    eyeBalise.addEventListener('load', () => {
        const svgDoc = eyeBalise.contentDocument
        const all = svgDoc.getElementById('all')
        const iris = svgDoc.getElementById('iris')
        const pupil = svgDoc.getElementById('pupil')

        eyeBalise.style.left = (Math.floor(Math.random() * document.documentElement.clientWidth)-250) + "px"
        eyeBalise.style.top = (Math.floor(Math.random() * document.documentElement.clientHeight)-250) + "px"
        eyeBalise.style.width = (Math.floor(Math.random() * 50) + 500) + "px"
        eyeBalise.style.height = eyeBalise.style.width

        const rdmColor = colors[Math.floor(Math.random() * colors.length)]
        const rdmSize = combinations[Math.floor(Math.random() * combinations.length)]

        all.setAttribute('stroke', rdmColor)
        pupil.setAttribute('fill', rdmColor)
        iris.setAttribute('r', rdmSize.i)
        pupil.setAttribute('r', rdmSize.p)
    })
}
export function initBackground() {
    document.querySelectorAll(".eye").forEach((eye) => {eye.remove()})

    const nbEye = 50

    const backgroundDiv = document.getElementById("background")
    for(let i = 0; i < nbEye; i++) {
        let eye = createEye(i)
        randomizeEye(eye)
        backgroundDiv.appendChild(eye)
    }
}

function createEventListeners() {
    window.addEventListener("resize", debounce(initBackground, 500))
}