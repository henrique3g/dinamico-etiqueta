const { remote } = require('electron');
const fs = require('fs').promises
const path = require('path')

const { webContents } = remote

const priceEl = document.querySelector('.price')
const resultEl = document.querySelector('.result')
const descriptionEl = document.querySelector('.product-name')
const bodyEl = document.body
const containerEl = document.querySelector('.container')
const listViewEl = document.querySelector('.list-view')
const ulListViewEl = document.querySelector('.list-view ul')

const searchEl = document.querySelector('.list-view input')

priceEl.focus()

let listViewVisible = false;
let indexItemSelected = 0;
let productList = [];
let filteredList = [];

async function readData() {
    const data = await fs.readFile(path.join(__dirname, 'database.json'), { encoding: 'utf8' })
    // console.log(data)
    return JSON.parse(data)
}
readData().then((data) => {
    // renderList(data)
    productList = data;
}).catch((err) => {
    console.log(err)
})

function renderList(products) {
    ulListViewEl.innerHTML = ''
    products.forEach((product, index) => {
        // console.log(value)
        const li = document.createElement('li')
        if (index === 0) {
            li.classList.add('selected')
        }
        const descriptionEl = document.createElement('span')
        const descriptionText = document.createTextNode(product.description)
        descriptionEl.appendChild(descriptionText)

        const priceEl = document.createElement('span')
        const priceText = document.createTextNode(Intl.NumberFormat('pr-BR', { currency: 'BRL', style: 'currency' }).format(product.price))
        priceEl.appendChild(priceText)

        li.appendChild(descriptionEl)
        li.appendChild(priceEl)
        ulListViewEl.appendChild(li)
    })
}

searchEl.onkeydown = e => {
    const search = e.target.value
    if (search.length < 3) return
    console.log(e)
    if (!(e.altKey || e.ctrlKey || e.shiftKey || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        if (!(e.key === 'Enter')) {
            filteredList = productList
                .filter((value) => (value.description.toUpperCase().includes(search.toUpperCase())))
            indexItemSelected = 0;
        }
    } else {
        e.preventDefault()
    }

    if (listViewVisible && e.key === 'ArrowDown' && indexItemSelected < filteredList.length - 1) {
        indexItemSelected++;
    }
    if (listViewVisible && e.key === 'ArrowUp' && indexItemSelected >= 1) {
        indexItemSelected--;
    }
    console.log(filteredList[indexItemSelected])
    const visibleList = filteredList.slice(indexItemSelected, indexItemSelected + 11)
    renderList(visibleList)
}

searchEl.onkeypress = e => {
    if (e.key === 'Enter') {
        toggleVisibleSections(true)
        const value = filteredList[indexItemSelected].price;
        const description = filteredList[indexItemSelected].description
        resultEl.innerHTML = `${Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }).format(value)}`
        descriptionEl.innerHTML = description
        console.log('imprimir')

        console.log(webContents.getAllWebContents()[1].print({
            silent: true,
            // dpi: [10, 20],
            // pageSize: { height: 100, width: 100 },
            margins: {
                marginType: 'printableArea',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        }, (succes) => {
            console.log(succes)
            toggleVisibleSections(false)

        }))
    }

}


bodyEl.onkeyup = e => {
    if (e.key === 'PageDown') {
        if (listViewVisible === false) {
            containerEl.style.display = 'none'
            listViewEl.style.display = 'flex'
            searchEl.focus()
            listViewVisible = true
            return
        }
        containerEl.style.display = 'flex'
        listViewEl.style.display = 'none'
        listViewVisible = false
        priceEl.focus()
        console.log('visible')
    }

}

function toggleVisibleSections(isVisible) {
    if (isVisible === false) {
        containerEl.style.display = 'none'
        listViewEl.style.display = 'flex'
        searchEl.focus()
        return
    }
    containerEl.style.display = 'flex'
    listViewEl.style.display = 'none'
    console.log('visible')
}

priceEl.onkeyup = e => {
    const value = e.target.value
    // const value = 5
    resultEl.innerHTML = `${Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }).format(value.replace(',', '.'))}`
    descriptionEl.innerHTML = ''
    console.log(value)

}

priceEl.onkeypress = e => {
    if (e.key === 'Enter') {
        if (e.target.value.length > 0) {

            console.log('imprimir')
            console.log(webContents.getAllWebContents())
            webContents.getAllWebContents()[1].print({
                silent: true,
                // dpi: [10, 20],
                // pageSize: { height: 100, width: 100 },
                margins: {
                    marginType: 'printableArea',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            }, (succes, err) => {
                console.log(succes)
                console.log(err)
            })
        }

    }
}
