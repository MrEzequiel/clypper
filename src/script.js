'use strict'

const { clipboard } = require('electron')

const containerCopy = document.querySelector('#copy')
const modalEl = document.querySelector('#modal')

function handleClickModal({ currentTarget }) {
  const text = JSON.parse(localStorage.getItem('prev'))
  if (currentTarget.dataset.done === '') {
    storage.set(text)
    createCopy(text)
  }

  modalEl.classList.remove('active')
}

const modal = () => {
  modalEl.classList.add('active')

  const buttons = modalEl.querySelectorAll('button')
  buttons.forEach(button => {
    button.addEventListener('click', handleClickModal)
  })
}

const storage = {
  get: () => {
    return JSON.parse(localStorage.getItem('copies')) || []
  },
  set: data => {
    const dataStorage = storage.get()
    dataStorage.unshift(data)
    localStorage.setItem('copies', JSON.stringify(dataStorage))
    return dataStorage
  },
  remove: index => {
    let dataStorage = storage.get()
    dataStorage = dataStorage.filter((item, indexItem) => {
      return indexItem !== index
    })
    localStorage.setItem('copies', JSON.stringify(dataStorage))
    return dataStorage
  }
}

let interval
const actions = ({ currentTarget }) => {
  if (currentTarget.dataset.remove === '') {
    const test = currentTarget.parentElement.parentElement
    const children = containerCopy.children
    const index = Array.from(children).indexOf(test)

    currentTarget.parentElement.parentElement.remove()
    storage.remove(index)
  } else {
    clearInterval(interval)

    const textCopy =
      currentTarget.parentElement.parentElement.firstElementChild.innerText
    clipboard.writeText(textCopy)
    const icon = "<span class='material-icons'>content_copy</span>"
    currentTarget.innerText = 'Copied!'

    interval = setTimeout(() => {
      currentTarget.innerHTML = icon
    }, 1500)
  }
}

function createCopy(text) {
  const container = document.createElement('div')
  container.classList.add('copy-item')

  container.innerHTML = `
    <p>${text}</p>

    <div class="action">
      <button type="button" data-copy>
        <span class="material-icons">
          content_copy
        </span>
      </button>
      <button data-remove>
        <span class="material-icons">
          delete
        </span>
      </button>
    </div>
  `

  const buttonsActions = container.querySelectorAll('.action button')
  buttonsActions.forEach(button => {
    button.addEventListener('click', actions)
  })

  if (containerCopy.firstChild === null) {
    containerCopy.append(container)
  } else {
    containerCopy.insertBefore(container, containerCopy.firstChild)
  }
}

const handleSubmit = e => {
  e.preventDefault()
  const copyText = e.srcElement[0].value.trim()

  if (!copyText) return

  createCopy(copyText)
  storage.set(copyText)
  e.srcElement[0].value = ''
  e.srcElement[0].focus()
}

const form = document.querySelector('.form-copy')
form.addEventListener('submit', handleSubmit)

window.addEventListener('focus', () => {
  const transferArea = clipboard.readText()
  if (!transferArea.trim()) return

  if (storage.get().includes(transferArea)) return
  if (JSON.parse(localStorage.getItem('prev'))?.includes(transferArea)) return
  localStorage.setItem('prev', JSON.stringify(transferArea))

  const buttons = modalEl.querySelectorAll('button')
  buttons.forEach(button => {
    button.removeEventListener('click', handleClickModal)
  })

  modal()
})

window.addEventListener('load', () => {
  const textStorage = storage.get()
  textStorage.forEach(text => {
    createCopy(text)
  })
})
