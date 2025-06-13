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
    const svgNS = "http://www.w3.org/2000/svg"

    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("viewBox", "0 0 500 500")
    svg.setAttribute("width", "100")
    svg.setAttribute("height", "100")
    svg.classList.add("eye")
    svg.id = `e${i}`
    
    const defs = document.createElementNS(svgNS, "defs")
    const mask = document.createElementNS(svgNS, "mask")
    mask.setAttribute("id", `maskSclera${i}`)
    const rect = document.createElementNS(svgNS, "rect")
    rect.setAttribute("x", "0")
    rect.setAttribute("y", "0")
    rect.setAttribute("width", "500")
    rect.setAttribute("height", "500")
    rect.setAttribute("fill", "black")
    const path = document.createElementNS(svgNS, "path")
    path.setAttribute("d", "M50 250 c200 100 200 100 400 0 c-200 -100 -200 -100 -400 0z")
    path.setAttribute("fill", "white")
    mask.appendChild(rect)
    mask.appendChild(path)
    defs.appendChild(mask)
    svg.appendChild(defs)

    const all = document.createElementNS(svgNS, "g")
    all.setAttribute("id", "all")
    all.setAttribute("fill", "none")
    all.setAttribute("stroke", "black")
    all.setAttribute("stroke-width", "5")

    const frontier = document.createElementNS(svgNS, "g")
    frontier.setAttribute("id", "frontier")
    const frontierPath = document.createElementNS(svgNS, "path")
    frontierPath.setAttribute("d", "M50 250 c200 100 200 100 400 0 c-200 -100 -200 -100 -400 0z")
    frontier.appendChild(frontierPath)
    all.appendChild(frontier)

    const maskedGroup = document.createElementNS(svgNS, "g")
    maskedGroup.setAttribute("mask", `url(#maskSclera${i})`)
    const pupil = document.createElementNS(svgNS, "circle")
    pupil.setAttribute("id", "pupil")
    pupil.setAttribute("cx", "250")
    pupil.setAttribute("cy", "250")
    pupil.setAttribute("r", "10")
    pupil.setAttribute("fill", "black")
    const iris = document.createElementNS(svgNS, "circle")
    iris.setAttribute("id", "iris")
    iris.setAttribute("cx", "250")
    iris.setAttribute("cy", "250")
    iris.setAttribute("r", "100")
    maskedGroup.appendChild(pupil)
    maskedGroup.appendChild(iris)
    all.appendChild(maskedGroup)

    svg.appendChild(all)

    return svg
}

export function randomizeEye(eye, backgroundDiv) {
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
    
    let cx = Math.floor(Math.random() * viewportWidth - radius)
    let cy = Math.floor(Math.random() * fullHeight - radius)

    const maxAdjustments = 100 
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
            const dx = cx - collision.cx
            const dy = cy - collision.cy
            const distance = Math.sqrt(dx ** 2 + dy ** 2)
            
            const pushDistance = radius
            const pushX = (dx / distance) * pushDistance
            const pushY = (dy / distance) * pushDistance
            
            cx += pushX
            cy += pushY
            cy = Math.max(radius, Math.min(fullHeight - radius, cy))
        }

        adjustments++
    } while (collision && adjustments < maxAdjustments)
        
    if (!collision) {
        eye.style.left = `${cx - radius}px`
        eye.style.top = `${cy - radius}px`
        eye.style.width = `${size}px`
        eye.style.height = `${size}px`
        
        allEyes.push({
            cx: cx,
            cy: cy,
            r: radius
        })
        eye.style.rotate = `${Math.floor(Math.random() * limits.rotationRange * 2) - limits.rotationRange}deg`
        
        const rdmColor = colors[Math.floor(Math.random() * colors.length)]
        const rdmSize = combinations[Math.floor(Math.random() * combinations.length)]
        
        const iris = eye.querySelector("#iris")
        const pupil = eye.querySelector("#pupil")
        const all = eye.querySelector("#all")
        
        all.setAttribute('stroke', rdmColor)
        pupil.setAttribute('fill', rdmColor)
        iris.setAttribute('r', rdmSize.i)
        pupil.setAttribute('r', rdmSize.p)

        backgroundDiv.appendChild(eye)
        
        const rotationAngle = parseFloat(eye.style.rotate) || 0;
        let lastMousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

        if (iris && pupil) {
            const eyeMoves = (event) => {
                const mouseX = event.clientX !== undefined ? event.clientX : lastMousePosition.x
                const mouseY = event.clientY !== undefined ? event.clientY : lastMousePosition.y

                if (event.clientX !== undefined && event.clientY !== undefined) {
                    lastMousePosition.x = event.clientX
                    lastMousePosition.y = event.clientY
                }

                const eyeBounds = eye.getBoundingClientRect()

                const relativeX = mouseX - eyeBounds.left - eyeBounds.width / 2
                const relativeY = mouseY - eyeBounds.top - eyeBounds.height / 2

                const angleRad = (-rotationAngle * Math.PI) / 180
                const rotatedX = relativeX * Math.cos(angleRad) - relativeY * Math.sin(angleRad)
                const rotatedY = relativeX * Math.sin(angleRad) + relativeY * Math.cos(angleRad)
        
                const maxOffsetX = 100
                const maxOffsetY = 50
                const offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, rotatedX))
                const offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, rotatedY))

                iris.setAttribute("cx", 250 + offsetX)
                iris.setAttribute("cy", 250 + offsetY)
                pupil.setAttribute("cx", 250 + offsetX)
                pupil.setAttribute("cy", 250 + offsetY)
            }
            document.addEventListener("mousemove", eyeMoves)
            document.addEventListener("scroll", () => {eyeMoves({})})
        }
    }
}

export function resetEyePositions() {
    document.querySelectorAll(".eye").forEach((eye) => {eye.remove()})
    allEyes.length = 0
}