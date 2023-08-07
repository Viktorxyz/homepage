import Suggestions from './Suggestions.js'

const SUGGESTIONS = new Suggestions()
const REGEX_VALID_URL = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
const REGEX_HORSE_ICON = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
const BTN_STATE = {
	add: 'add',
	cancel: 'cancel',
	hidden: 'hidden'
}

class SearchBar {
	constructor(searchBarForm, searchInput, suggestionList, plusBtn, suggestionTemplate) {
		let state, key, url, suggestions = null
		const setState = (s) => state = plusBtn.dataset.state = s

		const searchInputEvent = new Event('input', {
			bubbles: true,
			cancelable: true
		})

		const renderSuggestions = () => {
			const suggestionElements = []
			suggestions = SUGGESTIONS.suggestionsArray().map(suggestion => {
				const [key, url] = suggestion
				const suggestionElement = suggestionTemplate.content.cloneNode(true).children[0]
				const suggestionAnchor = suggestionElement.querySelector('a')
				const suggestionURL = suggestionElement.querySelector('span')
				const suggestionDeleteBtn = suggestionElement.querySelector('input')
				const suggestionFavicon = suggestionElement.querySelector('img')
				suggestionElement.style.display = 'none'
				suggestionElement.setAttribute('tabindex', -1)
				suggestionAnchor.setAttribute('href', url)
				suggestionAnchor.setAttribute('tabindex', 0)
				suggestionURL.innerText = url
				suggestionAnchor.insertBefore(document.createTextNode(key), suggestionURL)
				suggestionDeleteBtn.setAttribute('tabindex', -1)
				suggestionDeleteBtn.addEventListener('click', () => {
					SUGGESTIONS.remove(key)
					SUGGESTIONS.save()
					suggestionElement.remove()
					setState(BTN_STATE.add)
					renderSuggestions()
					searchInput.dispatchEvent(searchInputEvent)
				})
				suggestionFavicon.setAttribute('src', `https://icon.horse/icon/${REGEX_HORSE_ICON.exec(url)[1]}`)
				suggestionElements.push(suggestionElement)
				return { key, url, element: suggestionElement }
			})
			suggestionList.replaceChildren(...suggestionElements)
		}
		renderSuggestions()

		searchInput.addEventListener('keypress', (e) => {
			const input = e.target
			if (state === BTN_STATE.cancel && e.key === 'Enter') {
				if (REGEX_VALID_URL.test(url)) {
					SUGGESTIONS.add(key, url)
					SUGGESTIONS.save()
					renderSuggestions()
					setState(BTN_STATE.hidden)
					input.value = key
					input.setAttribute('placeholder', 'Search...')
					suggestionList.style.display = ''
					key = url = null
					input.dispatchEvent(searchInputEvent)
				}
				else {
					input.classList.add('regex-fail')
					setTimeout(() => input.classList.remove('regex-fail'), 1000 * 4)
				}
				e.preventDefault()
			}
		})
		searchInput.addEventListener('input', ({target: input}) => {
			const value = input.value
			if (state !== BTN_STATE.cancel) {
				let _state = BTN_STATE.add
				searchBarForm.action = 'http://google.com/search'
				suggestions.forEach(suggestion => {
					if (value != '') {
						if (suggestion.key.includes(value) || value === './') {
							suggestion.element.style.display = ''
							suggestion.element.style.order = 1
							suggestion.element.dataset.state = ''
							if (value === suggestion.key) {
								searchBarForm.action = suggestion.url
								suggestion.element.dataset.state = 'selected'
								suggestion.element.style.order = 0
								_state = BTN_STATE.hidden
							}
						} else suggestion.element.style.display = 'none'
					}
					else suggestion.element.style.display = 'none'
				})
				if (value.length <= 0 || value === './') _state = BTN_STATE.hidden
				if (_state === BTN_STATE.add) key = value
				else key = null
				if (state !== _state) setState(_state)
			} else {
				url = value
			}
		})

		plusBtn.addEventListener('click', (e) => {
			const toggle = () => {
				url = null
				searchInput.focus()
				if (e.target.dataset.state === BTN_STATE.add) {
					searchInput.value = ''
					searchInput.setAttribute('placeholder', 'Suggestion URL...')
					suggestionList.style.display = 'none'
					return BTN_STATE.cancel
				} else {
					searchInput.value = key
					searchInput.setAttribute('placeholder', 'Search...')
					suggestionList.style.display = ''
					return BTN_STATE.add
				}
			}
			setState(toggle())
		})
	}
}

export default SearchBar
export { SUGGESTIONS }