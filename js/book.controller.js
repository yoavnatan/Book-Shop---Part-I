'use strict'

var gFilterBy = ''
var gLayout = loadFromStorage('viewKey') || 'table'

function onInit() {
    render()
}


function render() {

    if (gLayout === 'cards') {

        const elBooksCard = document.querySelector('.cards-container')
        const books = getBooks(gFilterBy)

        var strHTML = books.map(book => `<div class="card">


<img alt="No image" src="${book.img}">
            <div class="title">${book.title}</div>
            <div class="price">${book.price}$</div>
            <div class="btns-conatiner">
            <span class="button btn-read" onclick="onReadBook('${book.id}')">Read</span>
                <span class="button btn-update" onclick="onUpdateBook('${book.id}')">Update</span>
                <span class="button btn-delete" onclick="onRemoveBook('${book.id}')">Delete</span>
                </div>
            </div>
            `
        )
        elBooksCard.style.display = 'flex'

        elBooksCard.innerHTML = strHTML.join('')
        return
    }

    // showElement('.table-container')
    const elBooksTable = document.querySelector('.table-container tbody')
    const books = getBooks(gFilterBy)

    if (!gBooks || gBooks.length < 1) {
        elBooksTable.innerHTML = `<tr><td class="empty-table" colspan="3">No matching books were found</td></tr>`
        _renderstats()
        return
    }

    var strHTML = books.map(book => `
            <tr>
                <td>${book.title}</td>
                <td>${book.price}</td>
                <td><span class="button btn-read" onclick="onReadBook('${book.id}')">Read</span>
                <span class="button btn-update" onclick="onUpdateBook('${book.id}')">Update</span>
                <span class="button btn-delete" onclick="onRemoveBook('${book.id}')">Delete</span>
                </td>
            </tr>`)
    elBooksTable.innerHTML = strHTML.join('')
    document.querySelector('.cards-container').style.display = 'none'

    showElement('.table-container')

    _renderstats()
}

function onSearchBook(elFilterBy) {
    gFilterBy = elFilterBy.value
    render()
}

function onClearClicked() {
    const elSearchLine = document.querySelector('input')
    elSearchLine.value = ''
    gFilterBy = ''
    render()
}


function onRemoveBook(bookId) {
    removeBook(bookId)
    document.querySelector('.modal').innerText = 'The book has been deleted'
    showElement('.modal')

    render()

    setTimeout(() => hideElement('.modal'), 2000)

}


function onUpdateBook(bookId) {
    const newPrice = prompt('Insert a new price')
    updatePrice(bookId, newPrice)
    render()

}

function onAddBook() {
    const title = prompt('Insert a book title')
    const price = +prompt('Insert a book price')
    if (!title || !price || price < 0) return alert('please insert propper inputs')
    addBook(title, price)
    render()
}

function onAddBookByModal() {
    const elAddModal = document.querySelector('.update-modal')
    elAddModal.showModal()
}

function onReadBook(bookId) {
    const elDetailsModal = document.querySelector('.details-modal')
    const elDetails = document.querySelector('.book-description')
    const elPrice = document.querySelector('.book-price span')
    const elTitle = document.querySelector('.book-title')
    const elImg = document.querySelector('.details-modal span')
    const elRate = document.querySelector('.book-rate span')

    const book = getBookById(bookId)

    console.log('book.rate', book.rate)
    if (book.img) {
        elImg.innerHTML = `<img src="${book.img}">`
        elDetails.innerText = book.description
        elPrice.innerText = book.price
        elTitle.innerText = book.title
        elRate.innerText = book.rate
    }
    else elDetails.innerText = JSON.stringify(book)

    elDetailsModal.dataset.bookId = bookId
    elDetailsModal.showModal()
}

function _renderstats() {
    const stats = gBooks.reduce((acc, book) => {
        if (book.price >= 200) acc.exp++
        else if (200 > book.price && book.price >= 80) acc.avg++
        else if (book.price < 80) acc.cheap++

        return acc
    }, { exp: 0, avg: 0, cheap: 0 })

    document.querySelector('.expensive-books span').innerText = stats.exp
    document.querySelector('.avarage-books span').innerText = stats.avg
    document.querySelector('.cheap-books span').innerText = stats.cheap
}

function onCardsView() {

    gLayout = 'cards'
    render()
    hideElement('.table-container')
    saveToStorage('viewKey', 'cards')
}

function onTableView() {

    gLayout = 'table'
    document.querySelector('.cards-container').style.display = 'none'
    render()
    saveToStorage('viewKey', 'table')

}

function onChangeRate(ev, diff) {
    ev.preventDefault()

    const elBookModal = document.querySelector('.details-modal')
    const bookId = elBookModal.dataset.bookId
    const book = updateRating(bookId, +diff)

    elBookModal.querySelector('.book-rate span').innerText = book.rate


    // var rate = +document.querySelector('.rate').innerText
    // rate += diff

    // document.querySelector('.rate').innerText = rate

}

function onInputPrice(elPriceInput) {

    var price = +elPriceInput.value
    elPriceInput.value = price.toFixed(2)
}

function onSubmit() {
    const bookTitle = document.getElementById('booktitle').value
    const bookprice = document.getElementById('bookprice').value
    const imgUrl = document.getElementById('bookimage').value
    addBook(bookTitle, bookprice, imgUrl)
    render()

}