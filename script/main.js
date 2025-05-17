import { createEye, eyeEvents, randomizeEye} from './eyes.js'
export function init() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
            })
        })
    })
    document.querySelectorAll('progress').forEach(progress => {
        const value = progress.getAttribute('value')
        progress.style.setProperty('--progress-width', `${value}%`)
    })
   
    initBackground()
    if (window.location.pathname == "/" ) {
        viewCV()
    }
}

export function initBackground() {
    document.querySelectorAll(".eye").forEach((eye) => {eye.remove()})

    const nbEye = 10
    const backgroundDiv = document.getElementById("background")
    for(let i = 0; i < nbEye; i++) {
        let eye = createEye(i)
        randomizeEye(eye)
        backgroundDiv.appendChild(eye)
    }

    eyeEvents()
}

export function debounce(func, wait) {
    let timer
    return function debouncedFunc(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => func(...args), wait)
    }
}

