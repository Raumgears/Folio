import { allEyes, createEye, randomizeEye, resetEyePositions} from './eyes.js'
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
    console.log("before :",allEyes)
    initBackground()
}

export function initBackground() {
    resetEyePositions()
    
    const nbEye = 100
    const backgroundDiv = document.getElementById("background")
    for(let i = 0; i < nbEye; i++) {
        let eye = createEye(i)
        randomizeEye(eye, backgroundDiv)
    }
    console.log("after :", allEyes)

 /*    eyeEvents() */
}

export function debounce(func, wait) {
    let timer
    return function debouncedFunc(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => func(...args), wait)
    }
}

