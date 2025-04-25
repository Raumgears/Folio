import { initBackground } from "./eyes.js"

export function init() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
            })
        })
    })
    initBackground()
}

export function debounce(func, wait) {
    let timer
    return function debouncedFunc(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => func(...args), wait)
    }
}