const LS_TITLE = 'suggestions.title'

export default class Title {
    constructor(spanTitle) {
        let title = localStorage.getItem(LS_TITLE)
        if (!title || title.length <= 0) title = 'Change me'
        spanTitle.style.setProperty('--steps', title.length)
        spanTitle.innerText = title
        spanTitle.addEventListener('input', ({ target }) => {
            if (target.innerText.length <= 32) {
                const newTitle = target.innerText
                spanTitle.style.width = `${newTitle.length}ch`
                localStorage.setItem(LS_TITLE, newTitle)
            }
        })
    }
}