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

export const allEyes = []

export function createEye(i) {
    const eyeBalise = document.createElement('object')
    eyeBalise.data = "./static/assets/eye.svg"
    eyeBalise.type = 'image/svg+xml'
    eyeBalise.classList.add("eye")
    eyeBalise.id = `e${i}`
    return eyeBalise
}

export function randomizeEye(eyeBalise, backgroundDiv) {
    eyeBalise.addEventListener('load', () => {
        const svgDoc = eyeBalise.contentDocument
        const all = svgDoc.getElementById('all')
        const iris = svgDoc.getElementById('iris')
        const pupil = svgDoc.getElementById('pupil')

        const limits = {
            minSize: 0.35,
            maxSize: 0.5,
            rotationRange: 90,
        }
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const fullHeight = document.body.scrollHeight * 0.9
        const sizeBase = Math.min(viewportWidth, viewportHeight)
        const size = Math.floor(sizeBase * (Math.random() * (limits.maxSize - limits.minSize) + limits.minSize))
        const radius = size / 2

        let cx = Math.floor(Math.random() * (viewportWidth - radius))
        let cy = Math.floor(Math.random() * (fullHeight - radius))

        const maxAdjustments = 100 // Limit the number of adjustments
        let adjustments = 0
        let collision

        do {
            collision = allEyes.find(existingEye => {
                const dx = cx - existingEye.cx
                const dy = cy - existingEye.cy
                const distance = Math.sqrt(dx ** 2 + dy ** 2)
                return distance < (radius + existingEye.r)
            })

            if (collision) {
                // Calculate the direction to push away
                const dx = cx - collision.cx
                const dy = cy - collision.cy
                const distance = Math.sqrt(dx ** 2 + dy ** 2)

                // Normalize the direction vector and push away
                const pushDistance = (radius + collision.r) - distance // Add a small buffer
                const pushX = (dx / distance) * pushDistance
                const pushY = (dy / distance) * pushDistance

                cx += pushX
                cy += pushY

                // Ensure the new position stays within bounds
                cx = Math.max(radius, Math.min(viewportWidth - radius, cx))
                cy = Math.max(radius, Math.min(fullHeight - radius, cy))
            }

            adjustments++
        } while (collision && adjustments < maxAdjustments)



        if (!collision) {
            eyeBalise.style.left = `${cx - radius}px`
            eyeBalise.style.top = `${cy - radius}px`
            eyeBalise.style.width = `${size}px`
            eyeBalise.style.height = `${size}px`

            allEyes.push({
                cx: cx,
                cy: cy,
                r: radius
            })
            eyeBalise.style.rotate = `${Math.floor(Math.random() * limits.rotationRange * 2) - limits.rotationRange}deg`
            
            const rdmColor = colors[Math.floor(Math.random() * colors.length)]
            const rdmSize = combinations[Math.floor(Math.random() * combinations.length)]
            
            all.setAttribute('stroke', rdmColor)
            pupil.setAttribute('fill', rdmColor)
            iris.setAttribute('r', rdmSize.i)
            pupil.setAttribute('r', rdmSize.p)
            backgroundDiv.appendChild(eye)
        }
    })
}

export function resetEyePositions() {
    document.querySelectorAll(".eye").forEach((eye) => {eye.remove()})
    allEyes.length = 0
}

/* export function eyeEvents() {
    document.addEventListener("mousemove", function (e) {
        console.log(e.clientX, e.clientY) 
        // T'ES ICI FDP
    })
    window.addEventListener("resize", debounce(initBackground, 500))
}
 */