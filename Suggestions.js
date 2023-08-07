const LS_SUGGESTIONS = 'suggestions.suggestions'

const SuggestionsFromLocalStorage = () => {
	return JSON.parse(localStorage.getItem(LS_SUGGESTIONS)) || {}
}

export default class Suggestions {
	constructor(suggestions) {
		this.suggestions = suggestions || SuggestionsFromLocalStorage()
		this.suggestionsArray().forEach(suggestion => {
			this.add(suggestion[0], suggestion[1])
		});
	}
	suggestionsArray() { return Object.entries(this.suggestions) }
	add(key, url) { this.suggestions[key] = url }
	remove(suggestionKey) { return delete this.suggestions[suggestionKey] }
	merge(suggestions) { Object.assign(this.suggestions, suggestions) }
	replace(suggestions) { this.suggestions = suggestions }
	save() { localStorage.setItem(LS_SUGGESTIONS, JSON.stringify(this.suggestions)) }
}