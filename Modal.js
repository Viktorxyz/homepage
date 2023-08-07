import { SUGGESTIONS } from "./SearchBar.js"
import Suggestions from "./Suggestions.js"

const fileReader = new FileReader()
const REGEX_HORSE_ICON = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/

const validFileType = (file) => {
	return file.type === 'application/json'
}

const MODAL_STATE = {
	active: 'active',
	inactive: 'inactive'
}

export default class Modal {
	constructor(importBtn, exportBtn, modal, modalSuggestionList, mergeBtn, replaceBtn, cancelBtn, suggestionTemplate){
		let state, MODAL_SUGGESTIONS
		const setState = (s) => state = modal.dataset.state = s

		const renderSuggestions = () => {
			const suggestionElements = []
			MODAL_SUGGESTIONS.suggestionsArray().forEach(suggestion => {
				const [key, url] = suggestion
				const suggestionElement = suggestionTemplate.content.cloneNode(true).children[0]
				const suggestionAnchor = suggestionElement.querySelector('a')
				const suggestionURL = suggestionElement.querySelector('span')
				const suggestionDeleteBtn = suggestionElement.querySelector('input')
				const suggestionFavicon = suggestionElement.querySelector('img')
				// suggestionElement.style.display = 'none'
				// suggestionElement.setAttribute('tabindex', -1)
				suggestionAnchor.insertBefore(document.createTextNode(key), suggestionURL)
				suggestionAnchor.setAttribute('href', url)
				// suggestionAnchor.setAttribute('tabindex', 0)
				suggestionURL.innerText = url
				suggestionURL.style.opacity = 0.3
				// suggestionDeleteBtn.setAttribute('tabindex', -1)
				suggestionDeleteBtn.addEventListener('click', () => {
					MODAL_SUGGESTIONS.remove(key)
					suggestionElement.remove()
					renderSuggestions()
				})
				suggestionFavicon.setAttribute('src', `https://icon.horse/icon/${REGEX_HORSE_ICON.exec(url)[1]}`)
				console.log(suggestionElement, suggestionAnchor);
				suggestionElements.push(suggestionElement)
			})
			modalSuggestionList.replaceChildren(...suggestionElements)
		}

        fileReader.addEventListener('load', () => {
			MODAL_SUGGESTIONS = new Suggestions(JSON.parse(fileReader.result))
         	setState(MODAL_STATE.active)
			renderSuggestions()
        })

		importBtn.addEventListener('change', () => {
            const file = importBtn.files[0]
            if (validFileType(file)) {
                fileReader.readAsText(file)
            }
        })

        exportBtn.addEventListener('click', () => {
            const fileName = 'suggestions'
            const file = new Blob([JSON.stringify(SUGGESTIONS.suggestions)], { type: 'application/json' })
            if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, fileName)
            else {
                const a = document.createElement('a'), url = URL.createObjectURL(file)
                a.href = url
                a.download = fileName
                document.body.appendChild(a)
                a.click()
                setTimeout(() => {
                    document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                }, 0)
            }
        })

		mergeBtn.addEventListener('click', () => {
			setState(MODAL_STATE.inactive)
			SUGGESTIONS.merge(MODAL_SUGGESTIONS.suggestions)
			SUGGESTIONS.save()
		})
		replaceBtn.addEventListener('click', () => {
			setState(MODAL_STATE.inactive)
			SUGGESTIONS.replace(MODAL_SUGGESTIONS.suggestions)
			SUGGESTIONS.save()
		})
		cancelBtn.addEventListener('click', () => {
			setState(MODAL_STATE.inactive)
		})
	}
}