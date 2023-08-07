import SearchBar from './SearchBar.js'
import Modal from './Modal.js'
import Title from './Title.js'

const searchBarForm = document.getElementById('search-bar-form')
const suggestionsList = document.getElementById('search-suggestions-list')
const searchInput = document.getElementById('search-input')
const plusBtn = document.getElementById('search-plus-btn')
const suggestionTemplate = document.getElementById('temp-suggestion')

const modal = document.getElementById('modal')
const modalSuggestions = document.getElementById('modal-suggestions')

const importBtn = document.getElementById('footer-import')
const exportBtn = document.getElementById('footer-export')

const modalMergeBtn = document.getElementById('modal-merge-btn')
const modalReplaceBtn = document.getElementById('modal-replace-btn')
const modalCancelBtn = document.getElementById('modal-cancel-btn')

const inputTitle = document.getElementById('span-title')

new SearchBar(searchBarForm, searchInput, suggestionsList, plusBtn, suggestionTemplate)
new Modal(importBtn, exportBtn, modal, modalSuggestions, modalMergeBtn, modalReplaceBtn, modalCancelBtn, suggestionTemplate)
new Title(inputTitle)